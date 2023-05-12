const Partidos = require("../models/Partido");
const Candidatos = require("../models/Candidato");


exports.GetPartidosList = (req, res, next) => {
    Partidos.findAll({ include: [{ model: Candidatos }] })
        .then((result) => {
            const partidos = result.map((result) => result.dataValues).filter(x => x.nombre != "Ninguno");

            res.render("partidos/partidos-list", {
                pageTitle: "Partidos",
                partidosActive: true,
                partidos: partidos,
                hasPartidos: partidos.length > 0,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetCreatePartidos = (req, res, next) => {
    res.render("partidos/save-partidos", {
        pageTitle: "Create partidos",
        partidosActive: true,
        editMode: false,
    });
};

exports.PostCreatePartidos = (req, res, next) => {
    const partidoNombre = req.body.Nombre;
    const partidoDescripcion = req.body.Descripcion;
    const partidoLogoPartido = req.file;
    const partidoEstado = req.body.Estado;

    if (!partidoLogoPartido) {
        return res.redirect("/");
    }

    Partidos.create
        ({
            nombre: partidoNombre,
            descripcion: partidoDescripcion,
            logoUrl: "/" + partidoLogoPartido.path,
            estado: partidoEstado
        })
        .then((result) => {
            res.redirect("/partidos");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetEditPartidos = (req, res, next) => {
    const edit = req.query.edit;
    const partidoId = req.params.partidosId;

    if (!edit) {
        return res.redirect("/partidos");
    }

    Partidos.findOne({ where: { id: partidoId } })
        .then((result) => {
            const partido = result.dataValues;

            if (!partido) {
                return res.redirect("/partidos");
            }
            res.render("partidos/save-partidos", {
                pageTitle: "Edit partidos",
                partidosActive: true,
                editMode: edit,
                partido: partido,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.PostEditPartidos = (req, res, next) => {
    const partidoNombre = req.body.Nombre;
    const partidoDescripcion = req.body.Descripcion;
    const partidoLogoPartido = req.file;
    const partidoEstado = req.body.Estado;
    const partidoId = req.body.partidoId;

    Partidos.findOne({ where: { id: partidoId } })
        .then((result) => {

            const partido = result.dataValues;

            if (!partido) {
                return res.redirect("/");
            }

            const imagePath = partidoLogoPartido ? "/" + partidoLogoPartido.path : partido.imagePath;

            Partidos.update
                ({
                    nombre: partidoNombre,
                    descripcion: partidoDescripcion,
                    logoUrl: imagePath,
                    estado: partidoEstado,
                },
                    {
                        where: { id: partidoId }
                    })
                .then((result) => {
                    return res.redirect("/partidos");
                })
                .catch((err) => {
                    console.log(err);
                });
        })
        .catch((err) => {
            console.log(err);
        });
};


exports.ConfirmDeletePartidos = (req, res, next) => {
    const partidoId = req.params.partidosId;

    res.render("partidos/confirm-delete", {
        pageTitle: "Delete Partidos",
        partidosActive: true,
        partidoId: partidoId,
    });
};


exports.PostDeletePartidos = (req, res, next) => {
    const partidoId = req.body.partidosId;

    Partidos.findOne({ where: { id: partidoId } })
        .then((result) => {
            const partido = result.dataValues

            partido.estado = false;
            Partidos.update(partido, { where: { id: partido.id } }).then(result => {
                res.redirect("/partidos");
            }).catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
};

