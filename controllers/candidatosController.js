const Partidos = require("../models/Partido");
const Puestos = require("../models/Puesto");
const Candidatos = require("../models/Candidato");

let _candidatoId = null;

exports.GetCandidatosList = (req, res, next) => {
    Candidatos.findAll({ include: [{ model: Partidos }, { model: Puestos }] })
        .then((result) => {
            const candidatos = result.map((result) => result.dataValues).filter(c => c.id != 0);

            res.render("candidatos/candidatos-list", {
                pageTitle: "Candidatos",
                candidatosActive: true,
                candidatos: candidatos,
                hasCandidatos: candidatos.length > 0,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetCreateCandidatos = async (req, res, next) => {
    let allPartidos = []


    await Partidos.findAll()
        .then((result) => {
            const partidos = result.map((result) =>
                allPartidos.push(result.dataValues)
            );
        })
        .catch((err) => {
            console.log(err);
        });

    Puestos.findAll()
        .then((result) => {
            const puestos = result.map((result) => result.dataValues).filter(p => p.id != 0);
            allPartidos = allPartidos.filter(p => p.id != 0)
            res.render("candidatos/save-candidatos", {
                pageTitle: "Create candidatos",
                candidatosActive: true,
                editMode: false,
                puestos: puestos,
                partidos: allPartidos,

                hasPartidos: allPartidos.length > 0,
                hasPuestos: puestos.length > 0,
            });
        })
        .catch((err) => {
            console.log(err);
        });


};

exports.PostCreateCandidatos = (req, res, next) => {
    const candidatoNombre = req.body.Nombre;
    const candidatoApellido = req.body.Apellido;
    const candidatoPartido = req.body.Partidos;
    const candidatoPuesto = req.body.Puestos;
    const candidatoFotoPerfil = req.file;
    const candidatoEstado = req.body.Estado;

    if (!candidatoFotoPerfil) {
        return res.redirect("/");
    }
    Candidatos.create
        ({
            nombre: candidatoNombre,
            apellido: candidatoApellido,
            partidoId: candidatoPartido,
            puestoId: candidatoPuesto,
            imgUrl: "/" + candidatoFotoPerfil.path,
            estado: candidatoEstado
        })
        .then((result) => {
            res.redirect("/candidatos");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetEditCandidatos = (req, res, next) => {
    const edit = req.query.edit;
    const candidatoId = req.params.candidatosId;


    if (!edit) {
        return res.redirect("/candidatos");
    }

    let allPartidos = []

    Candidatos.findOne({ where: { id: candidatoId } })
        .then((result) => {
            const candidato = result.dataValues;

            if (!candidato) {
                return res.redirect("/candidatos");
            }

            Partidos.findAll()
                .then((result) => {
                    const partidos = result.map((result) =>
                        allPartidos.push(result.dataValues)
                    );
                })
                .catch((err) => {
                    console.log(err);
                });

            Puestos.findAll()
                .then((result) => {
                    const puestos = result.map((result) => result.dataValues).filter(x => x.id != 0);
                    allPartidos = allPartidos.filter(x => x.id != 0)
                    res.render("candidatos/save-candidatos", {
                        pageTitle: "Edit candidatos",
                        candidatosActive: true,
                        editMode: edit,
                        candidato: candidato,
                        partidos: allPartidos,
                        puestos: puestos,

                        hasPartidos: allPartidos.length > 0,
                        hasPuestos: puestos.length > 0,
                    });

                    console.log(puestos)


                })
                .catch((err) => {
                    console.log(err);
                });


        })
        .catch((err) => {
            console.log(err);
        });
};

exports.PostEditCandidatos = (req, res, next) => {
    const candidatoNombre = req.body.Nombre;
    const candidatoApellido = req.body.Apellido;
    const candidatoPartido = req.body.Partidos;
    const candidatoPuesto = req.body.Puestos;
    const candidatoFotoPerfil = req.file;
    const candidatoEstado = req.body.Estado;
    const candidatoId = req.body.candidatoId;

    Candidatos.findOne({ where: { id: candidatoId } })
        .then((result) => {

            const candidato = result.dataValues;

            if (!candidato) {
                return res.redirect("/");
            }

            const imagePath = candidatoFotoPerfil ? "/" + candidatoFotoPerfil.path : candidato.imagePath;

            Candidatos.update
                ({
                    nombre: candidatoNombre,
                    apellido: candidatoApellido,
                    partidoId: candidatoPartido,
                    puestoId: candidatoPuesto,
                    imgUrl: imagePath,
                    estado: candidatoEstado
                },
                    {
                        where: { id: candidatoId }
                    })
                .then((result) => {
                    return res.redirect("/candidatos");
                })
                .catch((err) => {
                    console.log(err);
                });
        }).catch((err) => {
            console.log(err);
        });

};


exports.ConfirmDeleteCandidatos = (req, res, next) => {
    const candidatoId = req.params.candidatosId;

    res.render("candidatos/confirm-delete", {
        pageTitle: "Delete Candidatos",
        candidatosActive: true,
        candidatoId: candidatoId,
    });
};


exports.PostDeleteCandidatos = (req, res, next) => {
    const candidatoId = req.body.candidatosId;

    Candidatos.findOne({ where: { id: candidatoId } })
        .then((result) => {
            const candidato = result.dataValues
            candidato.estado = false;
            Candidatos.update(candidato, { where: { id: candidato.id } }).then(result => {
                res.redirect("/candidatos");
            }).catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
};
