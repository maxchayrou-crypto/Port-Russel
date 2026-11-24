
const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée
 */
router.get("/", authMiddleware, userController.getAllUsers);

/**
 * @swagger
 * /api/users/{email}:
 *   get:
 *     summary: Récupérer un utilisateur par email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur récupéré
 *       404:
 *         description: Utilisateur introuvable
 */
router.get("/:email", authMiddleware, userController.getUserByEmail);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Créer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: nouvel_admin
 *               email:
 *                 type: string
 *                 example: nouvel_admin@test.fr
 *               password:
 *                 type: string
 *                 example: MotDePasse123
 *     responses:
 *       201:
 *         description: Utilisateur créé
 */
router.post("/", authMiddleware, userController.createUser);

/**
 * @swagger
 * /api/users/{email}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin_modifie
 *               password:
 *                 type: string
 *                 example: NouveauMotDePasse123
 *     responses:
 *       200:
 *         description: Utilisateur modifié
 *       404:
 *         description: Utilisateur introuvable
 */
router.put("/:email", authMiddleware, userController.updateUser);

/**
 * @swagger
 * /api/users/{email}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Utilisateur supprimé
 *       404:
 *         description: Utilisateur introuvable
 */
router.delete("/:email", authMiddleware, userController.deleteUser);

module.exports = router;
