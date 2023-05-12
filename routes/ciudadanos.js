const express = require("express");
const router = express.Router();

const ctrl = require("../controllers/ciudadanosController");
const auth = require("../middlewares/auth");

router.get("/ciudadanos", auth.isAdmin, ctrl.GetCiudadanos);
router.get("/create-ciudadanos", auth.isAdmin, ctrl.GetCreateCiudadano);
router.get("/edit-ciudadano/:ciudadanoId", auth.isAdmin, ctrl.GetEditCiudadano);
router.get("/confirm-delete-ciudadano/:ciudadanoId", auth.isAdmin, ctrl.ConfirmDeleteCiudadanos);

router.post("/create-ciudadanos", auth.isAdmin, ctrl.PostCreateCiudadano);
router.post("/edit-ciudadanos", auth.isAdmin, ctrl.PostEditCiudadano);
router.post("/delete-ciudadanos", auth.isAdmin, ctrl.PostDeleteCiudadano);

module.exports = router;