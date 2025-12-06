import express from 'express'
import getRfps from '../../controllers/rfps/get.js'
import createRfps from '../../controllers/rfps/create.js'
import getRfpsId from '../../controllers/rfps/getId.js'
import deleteRfp from '../../controllers/rfps/delete.js'
import editRfp from '../../controllers/rfps/edit.js'
import { convertRfpText } from "../../utils/ai.js"
import Rfp from "../../models/Rfp.js"

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

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
})

router.post("/", createRfps)



export default router