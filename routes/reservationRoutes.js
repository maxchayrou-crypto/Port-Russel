
const express = require("express");
const router = express.Router();

const reservationController = require("../controllers/reservationController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Reservations
 *   description: Gestion des réservations du port
 */

/**
 * @swagger
 * /api/reservations:
 *   get:
 *     summary: Récupérer toutes les réservations
 *     tags: [Reservations]
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 */
router.get("/", reservationController.getAllReservations);

/**
 * @swagger
 * /api/reservations/{id}:
 *   get:
 *     summary: Récupérer une réservation par son identifiant
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB de la réservation
 *     responses:
 *       200:
 *         description: Réservation récupérée avec succès
 *       404:
 *         description: Réservation introuvable
 */
router.get("/:id", reservationController.getReservationById);

/**
 * @swagger
 * /api/reservations:
 *   post:
 *     summary: Créer une réservation
 *     tags: [Reservations]
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
 *               - clientName
 *               - boatName
 *               - startDate
 *               - endDate
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 example: 1
 *               clientName:
 *                 type: string
 *                 example: Thomas Martin
 *               boatName:
 *                 type: string
 *                 example: Carolina
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-05"
 *     responses:
 *       201:
 *         description: Réservation créée avec succès
 *       401:
 *         description: Token manquant ou invalide
 */
router.post("/", authMiddleware, reservationController.createReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   put:
 *     summary: Modifier une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB de la réservation
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: integer
 *                 example: 1
 *               clientName:
 *                 type: string
 *                 example: Thomas Martin
 *               boatName:
 *                 type: string
 *                 example: Carolina
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2026-12-06"
 *     responses:
 *       200:
 *         description: Réservation modifiée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Réservation introuvable
 */
router.put("/:id", authMiddleware, reservationController.updateReservation);

/**
 * @swagger
 * /api/reservations/{id}:
 *   delete:
 *     summary: Supprimer une réservation
 *     tags: [Reservations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Identifiant MongoDB de la réservation
 *     responses:
 *       200:
 *         description: Réservation supprimée avec succès
 *       401:
 *         description: Token manquant ou invalide
 *       404:
 *         description: Réservation introuvable
 */
router.delete("/:id", authMiddleware, reservationController.deleteReservation);

module.exports = router;
