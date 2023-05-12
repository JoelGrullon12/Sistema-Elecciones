const Ciudadano = require("../models/Ciudadano");

exports.GetCiudadanos = (req, res, next) => {
    Ciudadano.findAll().then(result => {
        const ciudadanos = result.map(c => c.dataValues);
        res.render("ciudadanos/ciudadanos-list", {
            pageTitle: "Ciudadanos",
            ciudadanosActive: true,
            ciudadanos: ciudadanos,
            hasCiudadanos: ciudadanos.length > 0
        });
    }).catch(error => console.log(error));
};

exports.GetCreateCiudadano = (req, res, next) => {
    res.render("ciudadanos/save-ciudadanos", {
        pageTitle: "Create ciudadanos",
        ciudadanosActive: true,
        editMode: false,
    });
};

exports.PostCreateCiudadano = (req, res, next) => {
    const cedula = req.body.Cedula;
    const nombre = req.body.Nombre;
    const apellido = req.body.Apellido;
    const email = req.body.Email;
    const estado = req.body.Estado;

    Ciudadano.create({
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        email: email,
        estado: estado
    }).then(result => {
        res.redirect("/ciudadanos");
    }).catch(err => console.log(err));
};

exports.GetEditCiudadano = (req, res, next) => {
    const edit = req.query.edit;
    const ciudadanoId = req.params.ciudadanoId;

    if (!edit) {
        return res.redirect("/ciudadanos");
    }

    Ciudadano.findOne({where: { id: ciudadanoId }}).then(result => {
        const ciudadano = result.dataValues;
        res.render("ciudadanos/save-ciudadanos", {
            pageTitle: "Editar Ciudadano",
            ciudadanosActive: true,
            editMode: edit,
            ciudadano: ciudadano,
        });
    }).catch(err => console.log(err));
};

exports.PostEditCiudadano = (req, res, next) => {
    const ciudadanoId = req.body.ciudadanoId;
    const cedula = req.body.Cedula;
    const nombre = req.body.Nombre;
    const apellido = req.body.Apellido;
    const email = req.body.Email;
    const estado = req.body.Estado;

    Ciudadano.update({
        cedula: cedula,
        nombre: nombre,
        apellido: apellido,
        email: email,
        estado: estado
    }, {where: {id : ciudadanoId}}).then(result => {
        res.redirect("/ciudadanos");
    }).catch(err => console.log(err));
};

exports.ConfirmDeleteCiudadanos = (req, res, next) => {
    const ciudadanoId = req.params.ciudadanoId;

    res.render("ciudadanos/confirm-delete", {
        pageTitle: "Delete Ciudadanos",
        ciudadanosActive: true,
        ciudadanoId: ciudadanoId,
    });
};

exports.PostDeleteCiudadano = (req, res, next) => {
    const ciudadanoId = req.body.ciudadanoId;

    Ciudadano.findOne({ where: { id: ciudadanoId } })
        .then((result) => {
            const ciudadano = result.dataValues
            ciudadano.estado = false;
            Ciudadano.update(ciudadano, {where: {id: ciudadano.id}}).then(result => {
                res.redirect("/ciudadanos");
            }).catch(err => console.log(err));
        })
        .catch((err) => {
            console.log(err);
        });
}