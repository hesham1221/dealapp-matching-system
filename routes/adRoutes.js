import express from "express";
import {
  createAd,
  getAds,
  getUserAds,
  matchRequests,
} from "../controllers/adController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAds);
router.get("/my-ads", authMiddleware, getUserAds);
router.post("/", authMiddleware, createAd);
router.get("/match", authMiddleware, matchRequests);

export default router;
