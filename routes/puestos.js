const express = require('express');

const router = express.Router();
const auth = require("../middlewares/auth")

const puestosController = require('../controllers/PuestosController');

router.get("/puestos", auth.isAdmin, puestosController.GetPuestosList);
router.get("/create-puestos", auth.isAdmin, puestosController.GetCreatePuestos);
router.post("/create-puestos", auth.isAdmin, puestosController.PostCreatePuestos);
router.get("/edit-puestos/:puestosId", auth.isAdmin, puestosController.GetEditPuestos);
router.post("/edit-puestos", auth.isAdmin, puestosController.PostEditPuestos);
router.post("/delete-puestos", auth.isAdmin, puestosController.PostDeletePuestos);
router.get("/confirm-delete-puestos/:puestosId", auth.isAdmin, puestosController.ConfirmDeletePuestos);


module.exports = router;
