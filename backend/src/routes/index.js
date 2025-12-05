import express from 'express';

const router = express.Router();

router.get('/health', (req, res) => {
  res.status(200).json({ status: true , msg : " ALL IS WELL " });
});


export default router;