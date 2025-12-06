import express from 'express'
import getRfps from '../../controllers/rfps/get.js'
import createRfps from '../../controllers/rfps/create.js'

const router = express.Router()

router.get ("/get", getRfps)
router.post ("/create", createRfps)
router.get ("/get/:id", )


export default router