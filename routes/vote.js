const express = require("express")
const router = express.Router();
const ctrl = require("../controllers/voteController")
const auth = require("../middlewares/auth");

router.get("/votar", auth.isCiudadano, ctrl.GetIndex);

router.get("/elegir-candidato/", auth.isCiudadano, ctrl.GetCandidatos);
router.post("/elegir-candidato/", auth.isCiudadano, ctrl.PostGetCandidatos);
router.post("/votar-candidato", auth.isCiudadano, ctrl.PostVotarCandidato)
router.post("/finalizar-votacion", auth.isCiudadano, ctrl.PostFinishVotes)

module.exports = router