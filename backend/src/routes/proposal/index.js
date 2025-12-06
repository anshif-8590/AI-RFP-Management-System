import express from 'express'
import createProposal from '../../controllers/proposal/create.js'
import deleteProposal from '../../controllers/proposal/delete.js'
import getAllProposal from '../../controllers/proposal/get.js'
import getProposalById from '../../controllers/proposal/getId.js'
import Proposal from "../../models/Proposal.js";
import { parseProposalEmail } from '../../utils/ai.js'


const router = express.Router()

router.get("/", getAllProposal)
router.post("/", createProposal)
router.get("/:id", getProposalById)
router.delete("/:id", deleteProposal)

// manual creation of proposal by pasting vendor reply
router.post("/manual", async (req, res) => {
    try {
        const { rfpId, vendorId, rawEmail, fromEmail, subject } = req.body
        if (!rfpId || !vendorId || !rawEmail) {
            return res.status(400).json({ message: "RFP , vendor and email required " })
        }

        const proposal = await Proposal.create({
            rfpId,
            vendorId,
            rawEmail,
            fromEmail: fromEmail || null,
            subject: subject || null
        })
        return res.status(201).json({ message: "Success", proposal })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})
// get the proposal by rfpId 
router.get("/rfp/:rfpId", async ( req , res ) => {
    try {
        const { rfpId } = req.params
        const proposal = await Proposal.find({ rfpId})
        .populate("vendorId","name email")
        .sort({ createdAt:-1})

        return res.status(200).json({ message : "Success" , proposal })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

// getting structured fields from parse rawEmail using AI
router.post("/:id/parse", async ( req , res ) => {
    try {
        const { id } = req.params

        const proposal = await Proposal.findById( id )
        if ( !proposal ) {
            return res.status(404).json({ message : "Proposal not found"})
        }

        if ( !proposal.rawEmail ) {
            return res.status(400).json({ message : "Proposal has no rawEmail to parse "})
        }

        // calling AI helper
        const parsed = await parseProposalEmail(proposal.rawEmail)

        proposal.parseFields = parsed
        if (typeof parsed.price === "number" ) {
            proposal.price = parsed.price
        }

        if ( parsed.paymentTerms) {
            proposal.terms = parsed.paymentTerms
        }

        const finalData = await proposal.save()
        return res.status(200).json({ message : "Success" , finalData })
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
})

export default router