import express from 'express';
import RfpsRoutes from './rfps/index.js'
import vendorRoutes from "./vendor/index.js"
import ProposalsRoute from "./proposal/index.js"

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: true , msg : " ALL IS WELL " });
});


router.use('/rfps',RfpsRoutes)
router.use("/vendors",vendorRoutes)
router.use("/proposals",ProposalsRoute)

export default router;
