
const express = require("express");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/database");

const catwayRoutes = require("./routes/catwayRoutes");
const reservationRoutes = require("./routes/reservationRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const authController = require("./controllers/authController");
const catwayController = require("./controllers/catwayController");
const reservationController = require("./controllers/reservationController");
const userController = require("./controllers/userController");

const User = require("./models/user");
const Reservation = require("./models/Reservation");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 1000 * 60 * 60
    }
}));

app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes API
app.use("/api/catways", catwayRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Documentation Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Accueil
app.get("/", (req, res) => {
    res.render("home");
});

// Connexion
app.post("/login", authController.loginPage);

// Déconnexion
app.post("/logout", (req, res) => {
    if (!req.session) {
        return res.redirect("/");
    }

    req.session.destroy((error) => {
        if (error) {
            return res.status(500).send("Erreur lors de la déconnexion.");
        }

        res.clearCookie("connect.sid");
        res.redirect("/");
    });
});

// Tableau de bord
app.get("/dashboard", async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.redirect("/");
        }

        const user = await User.findById(req.session.userId)
            .select("-password");

        if (!user) {
            return res.redirect("/");
        }

        const today = new Date();

        const reservations = await Reservation.find({
            startDate: { $lte: today },
            endDate: { $gte: today }
        }).sort({ startDate: 1 });

        res.render("dashboard", {
            user,
            reservations
        });

    } catch (error) {
        console.error("Erreur dashboard :", error);
        res.status(500).send("Erreur lors du chargement du tableau de bord.");
    }
});

// CATWAYS

app.get("/catways", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await catwayController.renderCatways(req, res);
});

app.post("/catways/create", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await catwayController.createCatwayFromPage(req, res);
});

app.post("/catways/:number/delete", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await catwayController.deleteCatwayFromPage(req, res);
});

app.post("/catways/:number/update", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await catwayController.updateCatwayFromPage(req, res);
});

// RESERVATIONS

app.get("/reservations", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await reservationController.renderReservations(req, res);
});

app.post("/reservations/create", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        await Reservation.create(req.body);
        res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur création réservation :", error);
        res.status(400).send("Impossible d'ajouter la réservation : " + error.message);
    }
});

app.post("/reservations/:id/delete", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        const reservation = await Reservation.findByIdAndDelete(
            req.params.id
        );

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur suppression réservation :", error);
        res.status(500).send("Erreur lors de la suppression.");
    }
});

app.get("/reservations/:id/edit", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        res.render("reservations/edit", { reservation });

    } catch (error) {
        console.error("Erreur affichage modification :", error);
        res.status(500).send("Erreur lors du chargement du formulaire.");
    }
});

app.post("/reservations/:id/update", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur modification réservation :", error);
        res.status(400).send("Impossible de modifier la réservation : " + error.message);
    }
});

// UTILISATEURS

app.get("/users", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await userController.renderUsers(req, res);
});
// Afficher le formulaire de modification
app.get("/users/:email/edit", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        const user = await User.findOne({
            email: req.params.email
        }).select("-password");

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        res.render("users/edit", { user });

    } catch (error) {
        console.error("Erreur affichage modification :", error);
        res.status(500).send("Erreur lors du chargement du formulaire.");
    }
});
// Enregistrer les modifications d'un utilisateur
app.post("/users/:email/update", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await userController.updateUserFromPage(req, res);
});

app.post("/users/create", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    await userController.createUserFromPage(req, res);
});

app.post("/users/:email/delete", async (req, res) => {
    if (!req.session.userId) {
        return res.redirect("/");
    }

    try {
        const user = await User.findOne({
            email: req.params.email
        });

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        if (user._id.toString() === req.session.userId.toString()) {
            return res.status(400).send("Vous ne pouvez pas supprimer votre propre compte.");
        }

        await User.findByIdAndDelete(user._id);

        res.redirect("/users");

    } catch (error) {
        console.error("Erreur suppression utilisateur :", error);
        res.status(500).send("Erreur lors de la suppression.");
    }
});

// Démarrage du serveur
const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Serveur lancé sur http://localhost:${PORT}`);
        });

    } catch (error) {
        console.error("Erreur au démarrage :", error.message);
        process.exit(1);
    }
};

startServer();
