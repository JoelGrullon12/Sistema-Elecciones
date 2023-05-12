const express = require('express');

const router = express.Router();
const auth = require("../middlewares/auth")

const candidatosController = require('../controllers/CandidatosController');

router.get("/candidatos", auth.isAdmin, candidatosController.GetCandidatosList);
router.get("/create-candidatos", auth.isAdmin, candidatosController.GetCreateCandidatos);
router.post("/create-candidatos", auth.isAdmin, candidatosController.PostCreateCandidatos);
router.get("/edit-candidatos/:candidatosId", auth.isAdmin, candidatosController.GetEditCandidatos);
router.post("/edit-candidatos", auth.isAdmin, candidatosController.PostEditCandidatos);
router.post("/delete-candidatos", auth.isAdmin, candidatosController.PostDeleteCandidatos);
router.get("/confirm-delete-candidatos/:candidatosId", auth.isAdmin, candidatosController.ConfirmDeleteCandidatos);


module.exports = router;
