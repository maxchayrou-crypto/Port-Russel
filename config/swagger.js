
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Port-Russel API",
            version: "1.0.0",
            description: "Documentation de l'API de gestion des catways et des réservations du port de plaisance Port-Russel."
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Serveur local"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        }
    },
    apis: ["./routes/*.js", "./controllers/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
