const Ciudadano = require("../models/Ciudadano")
const Usuario = require("../models/Usuario")
const Eleccion = require("../models/Eleccion")
const Voto = require("../models/Voto")
const Puesto = require("../models/Puesto")
const bcrypt = require("bcryptjs")
const userTypes = require("../utils/userTypes");
const Candidato = require("../models/Candidato")

exports.GetLogin = (req, res, next) => {
    res.render("auth/login", {
        pageTitle: "Ingresar"
    })
}

exports.PostLogin = async (req, res, next) => {
    const cedula = req.body.cedula ?? false;

    if (!cedula) {
        req.flash("errors", "Datos Invalidos")
        return res.status(400).redirect("/")
    }

    const ciudadano = await Ciudadano.findOne({
        where: {
            cedula: cedula
        }
    });

    if (!ciudadano) {
        req.flash("errors", "No se ha encontrado un ciudadano con esa cedula")
        return res.redirect("/");
    }

    if (!ciudadano.estado) {
        req.flash("errors", "Este ciudadano esta inactivo, contacte con el administrador de su provincia para activar su usuario")
        return res.redirect("/");
    }

    const elecciones = await Eleccion.findOne({
        where: {
            estado: true
        }
    })

    if (!elecciones || elecciones.length <= 0) {
        req.flash("errors", "No hay ninguna eleccion activa en este momento, vuelva cuando exista una eleccion activa en su zona")
        return res.redirect("/");
    }

    let puestos = await Puesto.findAll({
        where: {
            estado: true
        },
        include: [Voto, Candidato]
    });

    if (!puestos || puestos.length <= 0) {
        req.flash("errors", "Error interno, no se pueden mostrar los puestos, contacte con el administrador de su sector")
        return res.redirect("/")
    }

    puestos = puestos.map((result) => result.dataValues);
    puestos = puestos.filter(p => p.candidatos.length > 0)

    if (!puestos || puestos.length <= 0) return res.redirect("/")

    let votaciones = []
    for (let i = 0; i < puestos.length; i++) {

        const v = await Voto.findOne({
            where: {
                ciudadanoId: ciudadano.id,
                eleccionId: elecciones.id,
                puestoId: puestos[i].id
            }
        })

        if (v != null) {
            votaciones.push(v)
        }
    }

    if (votaciones.length == puestos.length) {
        req.flash("errors", "Ya ha ejercido su derecho al voto en estas elecciones, no se acepta mas de un voto por ciudadano")
        return res.redirect("/")
    }

    req.session.isLoggedIn = true;
    req.session.user = ciudadano;
    req.session.userType = userTypes.Ciudadano
    req.session.eleccion = elecciones.dataValues;
    req.session.isEleccion = true;
    await req.session.save()

    res.redirect("/votar")
}

exports.GetAdmin = (req, res, next) => {
    res.render("auth/adminLogin", {
        pageTitle: "Administradores",
        adminView: true
    })
}

exports.PostAdmin = async (req, res, next) => {
    const username = req.body.user ?? false;
    const password = req.body.password ?? false;

    if (!username || !password) {
        req.flash("errors", "Datos Invalidos")
        return res.redirect("/")
    }

    const user = await Usuario.findOne({
        where: {
            username: username
        }
    })

    if (!user) {
        req.flash("errors", "Usuario y/o Contraseña incorrecta")
        return res.redirect("/admin");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        req.flash("errors", "Usuario y/o Contraseña incorrecta")
        return res.redirect("/admin");
    }

    if (!user.estado) {
        req.flash("errors", "Error, este usuario esta inactivo")
        return res.redirect("/admin");
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.userType = userTypes.Admin;
    await req.session.save()
    res.redirect("/home")
}

exports.PostLogOut = async (req, res, next) => {
    await req.session.destroy()
    res.redirect("/");
}