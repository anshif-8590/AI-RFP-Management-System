import express from "express";
import { syncInbox } from "../controllers/emailController.js";

const router = express.Router();

router.post("/sync", syncInbox);

export default router;
