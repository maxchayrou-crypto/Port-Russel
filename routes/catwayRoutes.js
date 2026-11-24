
const express = require("express");
const router = express.Router();

const catwayController = require("../controllers/catwayController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Catways
 *   description: Gestion des catways du port
 */

/**
 * @swagger
 * /api/catways:
 *   get:
 *     summary: Récupérer tous les catways
 *     tags: [Catways]
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 */
router.get("/", catwayController.getAllCatways);

/**
 * @swagger
 * /api/catways/{number}:
 *   get:
 *     summary: Récupérer un catway par son numéro
 *     tags: [Catways]
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway
 *     responses:
 *       200:
 *         description: Catway récupéré avec succès
 *       404:
 *         description: Catway introuvable
 */
router.get("/:number", catwayController.getCatwayByNumber);

/**
 * @swagger
 * /api/catways:
 *   post:
 *     summary: Créer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - catwayNumber
 *               - catwayType
 *               - catwayState
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 example: 25
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *                 example: long
 *               catwayState:
 *                 type: string
 *                 example: Bon état
 *     responses:
 *       201:
 *         description: Catway créé avec succès
 *       401:
 *         description: Token manquant ou invalide
 */
router.post("/", authMiddleware, catwayController.createCatway);

/**
 * @swagger
 * /api/catways/{number}:
 *   put:
 *     summary: Modifier un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *                 example: long
 *               catwayState:
 *                 type: string
 *                 example: Entretien effectué
 *     responses:
 *       200:
 *         description: Catway modifié avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Catway introuvable
 */
router.put("/:number", authMiddleware, catwayController.updateCatway);

/**
 * @swagger
 * /api/catways/{number}:
 *   delete:
 *     summary: Supprimer un catway
 *     tags: [Catways]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: number
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numéro du catway à supprimer
 *     responses:
 *       200:
 *         description: Catway supprimé avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Catway introuvable
 */
router.delete("/:number", authMiddleware, catwayController.deleteCatway);

module.exports = router;

