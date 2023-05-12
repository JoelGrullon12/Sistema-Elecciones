const express = require('express');

const router = express.Router();
const auth = require("../middlewares/auth")

const partidosController = require('../controllers/PartidosController');

router.get("/partidos", auth.isAdmin, partidosController.GetPartidosList);
router.get("/create-partidos", auth.isAdmin, partidosController.GetCreatePartidos);
router.post("/create-partidos", auth.isAdmin, partidosController.PostCreatePartidos);
router.get("/edit-partidos/:partidosId", auth.isAdmin, partidosController.GetEditPartidos);
router.post("/edit-partidos", auth.isAdmin, partidosController.PostEditPartidos);
router.post("/delete-partidos", auth.isAdmin, partidosController.PostDeletePartidos);
router.get("/confirm-delete-partidos/:partidosId", auth.isAdmin, partidosController.ConfirmDeletePartidos);


module.exports = router;
