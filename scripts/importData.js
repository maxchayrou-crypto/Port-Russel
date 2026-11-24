
const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");
const connectDB = require("../config/database");

const Catway = require("../models/catways");
const Reservation = require("../models/reservation");

const catways = require("../data/catways.json");
const reservations = require("../data/reservations.json");

const importData = async () => {
    try {
        await connectDB();

        // Suppression des anciennes données avant réimportation
        await Catway.deleteMany({});
        await Reservation.deleteMany({});

        // Importation des données JSON
        await Catway.insertMany(catways);
        await Reservation.insertMany(reservations);

        console.log("Importation des catways réussie !");
        console.log("Importation des réservations réussie !");

        console.log(`Catways importés : ${catways.length}`);
        console.log(`Réservations importées : ${reservations.length}`);

    } catch (error) {
        console.error("Erreur lors de l'importation :", error.message);
    } finally {
        await mongoose.connection.close();
        console.log("Connexion MongoDB fermée.");
    }
};

importData();
