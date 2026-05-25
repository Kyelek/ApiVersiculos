const express = require('express');
const router = express.Router();
const Database = require("sqlite");
const sqlite3 = require('sqlite3'); // Necesario para el driver
const constants = require("../constants.js");
const queries = require("../queries.js");


const cors = require('cors');
/**
 * Ruta: /versiculos/:abreviatura
 */
router.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
/**
 * Ruta para obtener todos los libros
 */
router.get('/', async function(req, res) { 
  try {
    const db = await Database.open({
      filename: constants.DATABASE_NAME,
      driver: sqlite3.Database
    });
    
    let response = await db.all(queries.GET_ALL_LIBROS);
    await db.close();
    
    response = response && response.length > 0 ? response : constants.NOT_FOUND;
    res.json(response);
  } catch (error) {
    console.error("Error en /libros:", error);
    res.status(500).json({ error: "Error interno al obtener libros" });
  }
});

/**
 * Ruta para obtener un libro por su abreviatura
 */
router.get("/:abreviatura", async (req, res) => {
  const abreviatura = req.params.abreviatura.toUpperCase();  
  try {
    const db = await Database.open({
      filename: constants.DATABASE_NAME,
      driver: sqlite3.Database
    });
    
    let response = await db.get(queries.GET_LIBROS_BY_ABREVIATURA, { $abreviatura: abreviatura });
    await db.close();
    
    response = response ? response : constants.NOT_FOUND;
    res.json(response);
  } catch (error) {
    console.error("Error en /libros/:abreviatura:", error);
    res.status(500).json({ error: "Error interno al buscar el libro" });
  }
});

module.exports = router;