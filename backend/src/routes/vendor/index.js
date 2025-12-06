import express from 'express'
import getVendor from '../../controllers/vendor/get.js'
import createVendor from '../../controllers/vendor/create.js'
import getVendorId from '../../controllers/vendor/getId.js'
import editVendor from '../../controllers/vendor/edit.js'
import deleteVendor from '../../controllers/vendor/delete.js'



const router = express.Router()

router.get ("/", getVendor)
router.post ("/", createVendor)
router.get ("/:id", getVendorId)
router.put ("/:id", editVendor)
router.delete ("/:id", deleteVendor)


export default router