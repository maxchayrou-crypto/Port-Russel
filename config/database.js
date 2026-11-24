
const mongoose = require("mongoose");

/**
 * Connexion à la base de données MongoDB.
 * @async
 * @returns {Promise<void>}
 */
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connecté avec succès !");
    } catch (error) {
        console.error("Erreur de connexion MongoDB :", error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
