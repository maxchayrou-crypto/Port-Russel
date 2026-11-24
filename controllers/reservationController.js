
const Reservation = require("../models/reservation");

// Afficher toutes les réservations
exports.getAllReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find();
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Afficher une réservation
exports.getReservationById = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).json({
                message: "Réservation introuvable"
            });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Créer une réservation
exports.createReservation = async (req, res) => {
    try {
        const reservation = await Reservation.create(req.body);
        res.status(201).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Modifier une réservation
exports.updateReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).json({
                message: "Réservation introuvable"
            });
        }

        res.status(200).json(reservation);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer une réservation
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findByIdAndDelete(
            req.params.id
        );

        if (!reservation) {
            return res.status(404).json({
                message: "Réservation introuvable"
            });
        }

        res.status(200).json({
            message: "Réservation supprimée avec succès"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
// Afficher la page des réservations
exports.renderReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .sort({ startDate: 1 });

        res.render("reservations/index", {
            reservations
        });

    } catch (error) {
        console.error("Erreur affichage réservations :", error);
        res.status(500).send(
            "Erreur lors du chargement des réservations."
        );
    }
};