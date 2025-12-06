import express from 'express';
import RfpsRoutes from './rfps/index.js'

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: true , msg : " ALL IS WELL " });
});
router.use('/rfps',RfpsRoutes)

export default router;