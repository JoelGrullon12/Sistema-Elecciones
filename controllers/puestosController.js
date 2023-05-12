const Puestos = require("../models/Puesto");
const Candidatos = require("../models/Candidato");

let _puestoId = null;

exports.GetPuestosList = (req, res, next) => {
    Puestos.findAll({ include: [{ model: Candidatos }] })
        .then((result) => {
            const puestos = result.map((result) => result.dataValues).filter(x => x.nombre != "Ninguno");

            res.render("puestos/puestos-list", {
                pageTitle: "Puestos",
                puestosActive: true,
                puestos: puestos,
                hasPuestos: puestos.length > 0,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetCreatePuestos = (req, res, next) => {
    res.render("puestos/save-puestos", {
        pageTitle: "Create puestos",
        puestosActive: true,
        editMode: false,
    });
};

exports.PostCreatePuestos = (req, res, next) => {
    const puestoNombre = req.body.Nombre;
    const puestoDescripcion = req.body.Descripcion;
    const puestoEstado = req.body.Estado;


    Puestos.create
        ({
            nombre: puestoNombre,
            descripcion: puestoDescripcion,
            estado: puestoEstado
        })
        .then((result) => {
            res.redirect("/puestos");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.GetEditPuestos = (req, res, next) => {
    const edit = req.query.edit;
    const puestoId = req.params.puestosId;

    if (!edit) {
        return res.redirect("/puestos");
    }

    Puestos.findOne({ where: { id: puestoId } })
        .then((result) => {
            const puesto = result.dataValues;

            if (!puesto) {
                return res.redirect("/puestos");
            }
            res.render("puestos/save-puestos", {
                pageTitle: "Edit puestos",
                puestosActive: true,
                editMode: edit,
                puesto: puesto,
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.PostEditPuestos = (req, res, next) => {
    const puestoNombre = req.body.Nombre;
    const puestoDescripcion = req.body.Descripcion;
    const puestoEstado = req.body.Estado;

    const puestoId = req.body.puestoId;

    Puestos.update
        ({
            nombre: puestoNombre,
            descripcion: puestoDescripcion,
            estado: puestoEstado,
        },
            {
                where: { id: puestoId }
            })
        .then((result) => {
            return res.redirect("/puestos");
        })
        .catch((err) => {
            console.log(err);
        });
};

exports.ConfirmDeletePuestos = (req, res, next) => {
    const puestoId = req.params.puestosId;
    // _puestoId = puestoId;

    res.render("puestos/confirm-delete", {
        pageTitle: "Delete Puestos",
        puestosActive: true,
        puestoId: puestoId,
    });
};

exports.PostDeletePuestos = (req, res, next) => {
    const puestoId = req.body.puestosId;

    Puestos.findOne({ where: { id: puestoId } })
        .then((result) => {
            const puesto = result.dataValues
            puesto.estado = false;
            Puestos.update(puesto, { where: { id: puesto.id } }).then(result => {
                res.redirect("/puestos");
            }).catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });

};

