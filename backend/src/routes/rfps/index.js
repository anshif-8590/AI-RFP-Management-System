import express from 'express'
import getRfps from '../../controllers/rfps/get.js'
import createRfps from '../../controllers/rfps/create.js'
import getRfpsId from '../../controllers/rfps/getId.js'
import deleteRfp from '../../controllers/rfps/delete.js'
import editRfp from '../../controllers/rfps/edit.js'

const router = express.Router()

router.get ("/", getRfps)
router.post ("/", createRfps)
router.get ("/:id", getRfpsId)
router.put ("/:id", editRfp )
router.delete ("/:id", deleteRfp)


export default router