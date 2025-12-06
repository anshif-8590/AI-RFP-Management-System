import express from 'express'
import createProposal from '../../controllers/proposal/create.js'
import deleteProposal from '../../controllers/proposal/delete.js'
import getAllProposal from '../../controllers/proposal/get.js'
import getProposalById from '../../controllers/proposal/getId.js'


const router = express.Router()

router.get ("/", getAllProposal)
router.post ("/", createProposal)
router.get ("/:id", getProposalById)
router.delete ("/:id", deleteProposal)


export default router