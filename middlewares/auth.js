const types = require("../utils/userTypes");

const Eleccion = require("../models/Eleccion");

exports.isNotAuth = (req, res, next) => {
    if (req.session.isLoggedIn) {
        if (req.session.userType == types.Admin)
            return res.redirect("/home");
        else {
            return res.redirect("/votar");
        }
    }

    next();
}

exports.isAdmin = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }

    if (req.session.userType != types.Admin) {
        req.flash("errors", "No tienes permisos para entrar a esta seccion")
        return res.redirect("/votar");
    }

    const elecciones = await Eleccion.findOne({
        where: {
            estado: true
        }
    })

    if (!elecciones) {
        req.session.isEleccion = false
    } else {
        req.session.isEleccion = true
    }

    next();
}

exports.isCiudadano = async (req, res, next) => {
    if (!req.session.isLoggedIn) {
        return res.redirect("/");
    }

    if (req.session.userType != types.Ciudadano) {
        req.flash("errors", "No tienes permisos para entrar a esta seccion")
        return res.redirect("/home");
    }

    const elecciones = await Eleccion.findAll({
        where: {
            estado: true
        }
    });

    if (!elecciones || elecciones.length <= 0) {
        req.flash("errors", "No hay una eleccion activa en este momento, vuelva cuando exista una eleccion activa en su sector")
        return res.redirect("/home");
    }

    next();
}