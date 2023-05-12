const express = require('express');

const router = express.Router();
const auth = require("../middlewares/auth")

const eleccionesController = require('../controllers/EleccionesController');

router.get("/elecciones", auth.isAdmin, eleccionesController.GetEleccionesList);
router.get("/create-elecciones", auth.isAdmin, eleccionesController.GetCreateElecciones);
router.get("/resultados-elecciones/:eleccionId", auth.isAdmin, eleccionesController.GetResultadosElecciones);
router.get("/finalizar-elecciones/:eleccionId", auth.isAdmin, eleccionesController.GetFinishElecciones);

router.post("/create-elecciones", auth.isAdmin, eleccionesController.PostCreateElecciones);
router.post("/finalizar-eleccion", auth.isAdmin, eleccionesController.PostFinishElecciones);

router.get("/finalizar-elecciones/:eleccionId")
module.exports = router;
