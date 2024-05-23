import express from "express";
import { getAdminStats } from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import hasRoleMiddleware from "../middleware/hasRoleMiddleware.js";

const router = express.Router();


/**
 * @swagger
 * components:
 *   schemas:
 *     AdminStats:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The user's name
 *               phone:
 *                 type: string
 *                 description: The user's phone number
 *               role:
 *                 type: string
 *                 enum: [ADMIN, CLIENT, AGENT]
 *                 description: The user's role
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, DELETED]
 *                 description: The user's status
 *               adsCount:
 *                 type: integer
 *                 description: The number of ads created by the user
 *               totalAdsAmount:
 *                 type: number
 *                 description: The total amount of all ads created by the user
 *               requestsCount:
 *                 type: integer
 *                 description: The number of property requests created by the user
 *               totalRequestsAmount:
 *                 type: number
 *                 description: The total amount of all property requests created by the user
 *         page:
 *           type: integer
 *           description: The current page number
 *         limit:
 *           type: integer
 *           description: The number of results per page
 *         total:
 *           type: integer
 *           description: The total number of results
 *         hasNextPage:
 *           type: boolean
 *           description: Indicates if there is a next page of results
 *         hasPreviousPage:
 *           type: boolean
 *           description: Indicates if there is a previous page of results
 *       example:
 *         data:
 *           - name: Test User
 *             phone: 1234567890
 *             role: CLIENT
 *             status: ACTIVE
 *             adsCount: 0
 *             totalAdsAmount: 0
 *             requestsCount: 10
 *             totalRequestsAmount: 23600
 *         page: 1
 *         limit: 10
 *         total: 200
 *         hasNextPage: true
 *         hasPreviousPage: false
 */

/**
 * @swagger
 * /api/users/admin-stats:
 *   get:
 *     summary: Get admin stats
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: The page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of results per page
 *     responses:
 *       200:
 *         description: Admin stats retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminStats'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

router.get(
  "/admin-stats",
  authMiddleware,
  hasRoleMiddleware("ADMIN"),
  getAdminStats
);

export default router;
