import express from 'express'
import createProposal from '../../controllers/proposal/create.js'
import deleteProposal from '../../controllers/proposal/delete.js'
import getAllProposal from '../../controllers/proposal/get.js'
import getProposalById from '../../controllers/proposal/getId.js'
import Proposal from "../../models/Proposal.js";


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

export default router