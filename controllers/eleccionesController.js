const Elecciones = require("../models/Eleccion");
const Candidatos = require("../models/Candidato");
const Ciudadanos = require("../models/Ciudadano");
const Puestos = require("../models/Puesto");
const Votos = require("../models/Voto");


exports.GetEleccionesList = (req, res, next) => {
    Elecciones.findAll({ order: [["id", "DESC"]] })
        .then((result) => {
            let elecciones = result.map((result) => result.dataValues);
            let eleccionActiva = false
            if (elecciones.length > 0) {
                eleccionActiva = elecciones.find(x => x.estado === true);
            }
            res.render("elecciones/elecciones-list", {
                pageTitle: "Elecciones",
                eleccionesActive: true,
                elecciones: elecciones,
                eleccionActiva: eleccionActiva,
                hasElecciones: elecciones.length > 0,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetCreateElecciones = (req, res, next) => {
    Candidatos.findAll().then(result => {
        let canCreate = false;
        let candidatosActivos = [];
        result.map(c => {
            console.log(c.dataValues.estado);
            if (c.dataValues.estado == true) {
                candidatosActivos.push(c.dataValues.estado);
            }
        });
        if (candidatosActivos.length >= 2) {
            canCreate = true;
        }
        res.render("elecciones/save-elecciones", {
            pageTitle: "Crear elecciones",
            eleccionesActive: true,
            exitCandidatos: canCreate,
            editMode: false,
        });
    }).catch(err => console.log(err));
};

exports.GetResultadosElecciones = async (req, res, next) => {
    const eleccionId = req.params.eleccionId;
    console.log("ELECCION ID", eleccionId);

    let puestos;
    await Puestos.findAll({ include: [Votos, Candidatos] })
        .then(async result => {

            puestos = result.map(x => x.dataValues).filter(x => {
                const votos = x.votos.map(v => v.dataValues);
                return votos.some(j => j.eleccionId == eleccionId);
            });

            puestos = await Promise.all(puestos.map(async puesto => {

                let candidatos;
                let totalVotos = 0;
                await Candidatos.findAll({
                    include: [Votos],
                    where: { puestoId: puesto.id }
                }).then(async cresult => {


                    let ningunCandidato = await Candidatos.findOne({
                        include: [Votos],
                        where: {
                            id: 0
                        }
                    });
                    ningunCandidato.dataValues.votos = ningunCandidato.dataValues.votos.filter(v => {
                        return v.dataValues.eleccionId == eleccionId && v.dataValues.puestoId == puesto.id
                    })
                    cresult.push(ningunCandidato);


                    candidatos = cresult.map(c => c.dataValues).filter(c => {
                        const votos = c.votos.map(v => v.dataValues);
                        totalVotos += votos.filter(v => v.eleccionId == eleccionId).length
                        return votos.some(j => j.eleccionId == eleccionId);
                    })
                }).catch(err => console.log("Error Candidatos:", err))

                puesto.totalVotos = totalVotos;

                candidatos = await Promise.all(candidatos.map(async candidato => {

                    let votos;
                    await Votos.findAll({
                        where: {
                            eleccionId: eleccionId,
                            candidatoId: candidato.id
                        }
                    }).then(vresult => {
                        votos = vresult.map(v => v.dataValues).filter(v => v.puestoId == puesto.id);
                    }).catch(err => console.log("Error Votos:", err))

                    candidato.votos = votos.length
                    candidato.porcentaje = ((votos.length / puesto.totalVotos) * 100).toFixed(2)
                    candidato.porcentajeInt = parseInt((votos.length / puesto.totalVotos) * 100)
                    candidato.porcentajeRestante = 100 - candidato.porcentajeInt
                    return candidato
                }))

                puesto.candidatos = candidatos.sort((a, b) => {
                    return b.votos - a.votos;
                });

                return puesto;
            }))
        }).catch(err => console.log(err));

    res.render("elecciones/resultados-elecciones", {
        pageTitle: "Resultado Eleccion",
        puestos: puestos
    });
}

exports.PostCreateElecciones = (req, res, next) => {
    const eleccionNombre = req.body.Nombre;
    const fechaEleccion = new Date().toString();

    Elecciones.create
        ({
            nombre: eleccionNombre,
            fecha: fechaEleccion,
            estado: true
        })
        .then((result) => {
            res.redirect("/elecciones");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetFinishElecciones = (req, res, next) => {
    const eleccionId = req.params.eleccionId;
    Elecciones.findOne({
        where: {
            id: eleccionId
        }
    })
        .then(r => {
            const eleccion = r.dataValues;
            res.render("elecciones/finish-elecciones", {
                pageTitle: "Finalizar Eleccion",
                eleccionesActive: true,
                eleccion: eleccion,
            });
        }).catch(err => console.log(err));
}

exports.PostFinishElecciones = (req, res, next) => {
    const eleccionId = req.body.eleccionId;

    Elecciones.findOne({
        where: {
            id: eleccionId
        }
    })
        .then(r => {
            const eleccion = r.dataValues;
            eleccion.estado = false;

            Elecciones.update(eleccion, { where: { id: eleccionId } }).then(result => {
                res.redirect("/elecciones");
            }).catch(err => console.log(err));

        }).catch(err => console.log(err));
}