const express = require("express");
const app = express();
const cors = require("cors"); // 1. Importa CORS
const Database = require("sqlite");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const constants = require("./constants.js");
const routes = require('./routes.js');
const swaggerDefinition = require('./swagger.js');

const port = process.env.PORT || 3000;

// Configuración de CORS
const corsOptions = {
  origin: '*', 
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
};

app.use(cors(corsOptions));

var options = {
  swaggerDefinition,
  apis: ["./routes/*.js"]
};

const swaggerSpec = swaggerJSDoc(options);

// 3. Rutas
app.use("/", routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec)); // He cambiado la ruta para que no solape todo

app.listen(port, () =>
  console.log(`BibliAPI listening at http://localhost:${port}`)
);