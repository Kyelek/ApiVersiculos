const express = require('express');
const router = express.Router();
const Database = require("sqlite");
const sqlite3 = require('sqlite3'); // Driver necesario
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
router.get("/:abreviatura", async (req, res) => {
  const abreviatura = req.params.abreviatura.toUpperCase();  
  try {
    const db = await Database.open({
      filename: constants.DATABASE_NAME,
      driver: sqlite3.Database
    });
    
    let rows = await db.all(queries.GET_VERSICULO_BY_ABREVIATURA, { $abreviatura: abreviatura });
    await db.close();

    // Procesamiento del diccionario
    let response = rows.reduce((r, a) => {
      r[a.capitulo] = [
        ...(r[a.capitulo] || []),
        { numero: a.versiculo, texto: a.texto },
      ];
      return r;
    }, {});

    response = Object.keys(response).length !== 0 ? response : constants.NOT_FOUND;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener versículos" });
  }
});

/**
 * Ruta: /versiculos/:abreviatura/:capitulo/:versiculo
 */
router.get("/:abreviatura/:capitulo/:versiculo", async (req, res) => {
  const abreviatura = req.params.abreviatura.toUpperCase();
  const capitulo = parseInt(req.params.capitulo);
  const versiculo = parseInt(req.params.versiculo);

  try {
    const db = await Database.open({
      filename: constants.DATABASE_NAME,
      driver: sqlite3.Database
    });
    
    let response = await db.get(queries.GET_VERSICULO_BY_ABREVIATURA_CAPITULO_VERSICULO, {
      $abreviatura: abreviatura,
      $capitulo: capitulo,
      $versiculo: versiculo,
    });
    await db.close();        
    
    response = response ? response : constants.NOT_FOUND;
    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el versículo" });
  }
});

/**
 * Ruta: /versiculos/:abreviatura/:capitulo
 */
router.get("/:abreviatura/:capitulo", async (req, res) => { 
  const abreviatura = req.params.abreviatura.toUpperCase();
  const capitulo = parseInt(req.params.capitulo);
  
  try { 
    const db = await Database.open({
      filename: constants.DATABASE_NAME,
      driver: sqlite3.Database
    }); 
    
    let response = await db.all(queries.GET_CAPITULO_BY_ABREVIATURA, {
      $abreviatura: abreviatura,
      $capitulo: capitulo
    });
    await db.close();
    
    response = response.length > 0 ? response : constants.NOT_FOUND;
    res.json(response);
  } catch (error) { 
    console.error(error);
    res.status(500).json({ error: "Error al obtener el capítulo" });
  }
});

module.exports = router;