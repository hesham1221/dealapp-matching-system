import express from "express";
import {
  createPropertyRequest,
  getPropertyRequests,
  getUserPropertyRequests,
  updatePropertyRequest,
} from "../controllers/propertyRequestController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     PropertyRequest:
 *       type: object
 *       required:
 *         - propertyType
 *         - area
 *         - price
 *         - city
 *         - district
 *       properties:
 *         propertyType:
 *           type: string
 *           enum: [VILLA, HOUSE, LAND, APARTMENT]
 *           description: The type of property requested
 *         area:
 *           type: number
 *           description: The area of the property requested
 *         price:
 *           type: number
 *           description: The price range of the property requested
 *         city:
 *           type: string
 *           description: The city where the property is requested
 *         district:
 *           type: string
 *           description: The district where the property is requested
 *         description:
 *           type: string
 *           description: Additional description of the property request
 *       example:
 *         propertyType: APARTMENT
 *         area: 90
 *         price: 30000
 *         city: Giza
 *         district: Dokki
 *         description: Looking for a cozy apartment
 */

/**
 * @swagger
 * /api/property-requests:
 *   post:
 *     summary: Create a new property request
 *     tags: [Property Requests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PropertyRequest'
 *     responses:
 *       201:
 *         description: Property request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PropertyRequest'
 *       400:
 *         description: Bad request
 */
router.post("/", authMiddleware, createPropertyRequest);

router.patch("/:id", authMiddleware, updatePropertyRequest);
router.get("/", authMiddleware, getPropertyRequests);
router.get("/my-requests", authMiddleware, getUserPropertyRequests);

export default router;
