
const Catway = require("../models/catways");

// Afficher tous les catways
exports.getAllCatways = async (req, res) => {
    try {
        const catways = await Catway.find();
        res.status(200).json(catways);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Afficher un catway
exports.getCatwayByNumber = async (req, res) => {
    try {
        const catway = await Catway.findOne({
            catwayNumber: req.params.number
        });

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable" });
        }

        res.status(200).json(catway);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Ajouter un catway
exports.createCatway = async (req, res) => {
    try {
        const catway = await Catway.create(req.body);
        res.status(201).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Modifier un catway
exports.updateCatway = async (req, res) => {
    try {
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.number },
            req.body,
            { new: true, runValidators: true }
        );

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable" });
        }

        res.status(200).json(catway);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Supprimer un catway
exports.deleteCatway = async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({
            catwayNumber: req.params.number
        });

        if (!catway) {
            return res.status(404).json({ message: "Catway introuvable" });
        }

        res.status(200).json({ message: "Catway supprimé" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Afficher la page des catways
exports.renderCatways = async (req, res) => {
    try {
        const catways = await Catway.find().sort({
            catwayNumber: 1
        });

        res.render("catways/index", { catways });

    } catch (error) {
        console.error("Erreur affichage catways :", error);
        res.status(500).send("Erreur lors du chargement des catways.");
    }
};
// Ajouter un catway depuis le site web
exports.createCatwayFromPage = async (req, res) => {
    try {
        await Catway.create(req.body);

        res.redirect("/catways");

    } catch (error) {
        console.error("Erreur création catway :", error);
        res.status(400).send("Impossible d'ajouter le catway : " + error.message);
    }
};
// Supprimer un catway depuis le site web
exports.deleteCatwayFromPage = async (req, res) => {
    try {
        const catway = await Catway.findOneAndDelete({
            catwayNumber: req.params.number
        });

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        res.redirect("/catways");

    } catch (error) {
        console.error("Erreur suppression catway :", error);
        res.status(500).send("Erreur lors de la suppression du catway.");
    }
};
// Modifier l'état d'un catway depuis le site
exports.updateCatwayFromPage = async (req, res) => {
    try {
        const catway = await Catway.findOneAndUpdate(
            { catwayNumber: req.params.number },
            { catwayState: req.body.catwayState },
            { new: true, runValidators: true }
        );

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        res.redirect("/catways");

    } catch (error) {
        console.error("Erreur modification catway :", error);
        res.status(400).send("Impossible de modifier le catway.");
    }
};