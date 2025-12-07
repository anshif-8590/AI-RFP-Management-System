import express from 'express'
import getRfps from '../../controllers/rfps/get.js'
import createRfps from '../../controllers/rfps/create.js'
import getRfpsId from '../../controllers/rfps/getId.js'
import deleteRfp from '../../controllers/rfps/delete.js'
import editRfp from '../../controllers/rfps/edit.js'
import { convertRfpText } from "../../utils/ai.js"
import Rfp from "../../models/Rfp.js"
import Vendor from "../../models/Vendor.js";
import { sendRfpEmail, buildRfpEmailBody } from "../../utils/email.js";
import Proposal from '../../models/Proposal.js'
import { scoreProposals } from "../../utils/scoring.js";
import { generateRecommendationText } from "../../utils/ai.js";


const router = express.Router()

router.get("/", getRfps)
router.get("/:id", getRfpsId)
router.put("/:id", editRfp)
router.delete("/:id", deleteRfp)


router.post("/from-text", async (req, res) => {
    try {
        const { text } = req.body;
        if (!text || typeof text !== "string") {
            return res.status(400).json({ success: false, message: "text (string) is required in body" });
        }

        const structured = await convertRfpText(text);

        let title = structured?.title;

        // fallback base text for title: model description OR original text
        const baseForTitle = structured?.description || text;

        if (!title && typeof baseForTitle === "string") {
            title = baseForTitle.split(".")[0].slice(0, 60);
        }

        if (!title) title = "Untitled RFP";


        const rfpData = {
            title,
            description: structured.description || text,
            budget: structured.budget ?? null,
            items: structured.requirements || [],
            deliveryDate: structured.deadline ? new Date(structured.deadline) : null,
            paymentTerms: null,
            category: structured.category || null,
            contactPerson: structured.contactPerson || { name: null, email: null }
        };

        const created = await Rfp.create(rfpData);
        return res.status(201).json({ success: true, data: created });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

router.post("/", createRfps)

// SEND RFP TO MULTIPLE VENDORS
router.post("/:id/send", async (req, res) => {
  try {
    const { id } = req.params;
    const { vendorIds } = req.body;

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "vendorIds must be a non-empty array"
      });
    }

    // 1) Find RFP
    const rfp = await Rfp.findById(id);
    if (!rfp) return res.status(404).json({ success: false, message: "RFP not found" });

    // 2) Find Vendors
    const vendors = await Vendor.find({ _id: { $in: vendorIds } });
    if (vendors.length === 0)
      return res.status(404).json({ success: false, message: "No valid vendors found" });

    const results = [];

    // 3) Loop + Send Emails
    for (const vendor of vendors) {
      const subject = `Request for Proposal – ${rfp.title}`;
      const text = buildRfpEmailBody({ rfp, vendor });

      try {
        await sendRfpEmail({
          to: vendor.email,
          subject,
          text
        });

        // Success
        results.push({ vendorId: vendor._id, status: "sent" });
      } catch (error) {
        console.log("Email failed:", vendor.email, error.message);
        results.push({
          vendorId: vendor._id,
          status: "failed",
          error: error.message
        });
      }
    }

    // 4) Update RFP.sentTo
    const now = new Date();
    const successfulVendorIds = results
      .filter((r) => r.status === "sent")
      .map((r) => r.vendorId);

    if (successfulVendorIds.length > 0) {
      rfp.sentTo.push(
        ...successfulVendorIds.map((vId) => ({
          vendorId: vId,
          sentAt: now
          // date: now,      // <-- changed
          // status: "sent"  // <-- added
        }))
      );
      await rfp.save();
    }

    return res.status(200).json({
      success: true,
      message: `Emails processed for ${vendors.length} vendors`,
      //  sentTo: rfp.sentTo,   // <-- added
      results
    });

  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// get compare 
router.get("/:id/compare" , async ( req , res ) => {
  try {
    const { id } = req.params

    const proposals = await Proposal.find({ rfpId : id})
    .populate("vendorId","name email")

    if (proposals.length === 0) {
      return res.status(404).json({ message : "No proposals for this RFP "})
    }

    const scored = scoreProposals(proposals)

    const recommendation = await generateRecommendationText(scored)

    return res.status(200).json({ message : "Success" , recommendation })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
})


export default router