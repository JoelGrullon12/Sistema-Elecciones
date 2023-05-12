const Eleccion = require("../models/Eleccion");
const Puesto = require("../models/Puesto");
const Candidato = require("../models/Candidato");
const Partido = require("../models/Partido");
const Votos = require("../models/Voto");

const emailService = require("../services/EmailService");

//Get todos los puestos activos y que tengan candidatos
exports.GetIndex = async (req, res, next) => {
    let puestos = await Puesto.findAll({
        where: {
            estado: true
        },
        include: [Candidato, Votos]
    });

    //que existan puestos
    if (!puestos || puestos.length <= 0) {
        req.flash("errors", "Se ha producido un error al consultar los puestos electivos, contacte con el administrador de su sector")
        return res.redirect("/logout");
    }

    puestos = puestos.map((result) => result.dataValues);

    //filtrar puestos que no tengan candidatos
    puestos = puestos.filter(p => p.candidatos.length > 0)

    //si ya no quedan puestos por lo de arriba, quitar la session (sin destruirla para poder usar flash) y enviar un mensaje
    if (!puestos || puestos.length <= 0) {
        req.session.isLoggedIn = false;
        req.session.user = null;
        req.session.userType = null;
        req.flash("errors", "Se ha producido un error al consultar los puestos electivos, contacte con el administrador de su sector")
        return res.redirect("/");
    }

    const ciudadano = req.session.user;
    const elecciones = req.session.eleccion;

    //verificar por cuales puestos ya ha votado el ciudadano
    puestos = puestos.map(p => {
        p.votos = p.votos.filter(voto => voto.dataValues.eleccionId == elecciones.id && voto.dataValues.ciudadanoId == ciudadano.id)

        //si no hay votos es que no ha votado por ese puesto
        if (!p.votos || p.votos.length <= 0) {
            p.votado = false
        } else {
            p.votado = true
        }
        return p;
    })

    const todoVotado = puestos.every(p => p.votado)

    //revisar si ya el ciudadano voto por todos los puestos
    if (todoVotado) {
        req.flash("errors", "Votacion terminada, presione 'Finalizar Votacion' para cerrar sesion y salir del sistema, se le enviara un email a su direccion de correo electronico con sus votaciones")
        res.locals.errors = req.flash("errors")
    }

    //enviar datos a la vista
    return res.render("vote/vote-index", {
        pageTitle: "Votar",
        puestos: puestos,
        todoVotado: todoVotado
    })
}

//en caso de intentar ingresar a la pantalla de candidatos por Get
exports.GetCandidatos = (req, res, next) => {
    req.flash("errors", "Advertencia, entrada erronea, debe ingresar presionando el boton en el puesto deseado")
    res.redirect("/votar")
}

exports.PostGetCandidatos = async (req, res, next) => {
    const puestoId = req.body.puestoId ?? false;

    if (!puestoId) {
        req.flash("errors", "Datos Invalidos")
        return res.status(400).redirect("/")
    }

    //buscar los candidatos segun el puesto y que esten activos
    let candidatos = await Candidato.findAll({
        where: {
            estado: true,
            puestoId: puestoId
        },
        include: [Partido, Puesto]
    })



    //verificar si no hay candidatos en ese puesto
    if (!candidatos || candidatos.length <= 0) {
        req.flash("errors", "Error al cargar los candidatos, contacte con el administrador de su sector")
        return res.redirect("/votar");
    }

    //mapear
    candidatos = candidatos.map((result) => result.dataValues);

    //buscar el puesto para el nombre
    const puesto = (await Puesto.findOne({
        where: {
            id: puestoId
        }
    })).dataValues

    //verificar si no se ha votado por este puesto
    const voto = await Votos.findAll({
        where: {
            ciudadanoId: req.session.user.id,
            puestoId: puesto.id,
            eleccionId: req.session.eleccion.id
        }
    })

    if (!voto || voto.length <= 0) {
        //si no se ha votado se envian los datos a la vista
        return res.render("vote/candidatos", {
            pageTitle: "Elegir " + puesto.nombre,
            candidatos: candidatos,
            puesto: puesto

        })
    } else {
        //en caso de que ya se haya votado por ese puesto
        req.flash("errors", "Error, ya ha votado por ese puesto")
        return res.redirect("/votar")
    }
}

exports.PostVotarCandidato = async (req, res, next) => {
    //puesto y candidato elegido
    let id = req.body.candidatoId ?? false
    const idPuesto = req.body.puestoId ?? false;

    if (!id || !idPuesto) {
        req.flash("errors", "Datos Invalidos")
        return res.status(400).redirect("/")
    }

    //verificar si el candidato existe
    let candidato;
    if (id == 0) {
        //si el id es 0 es porque eligio ninguno, entonces solo se verifica el puesto
        candidato = await Puesto.findOne({
            where: {
                estado: true,
                id: idPuesto
            }
        })
    } else {
        //si es diferente de 0, es porque eligio un candidato, entonces se busca el candidato como tal
        candidato = await Candidato.findOne({
            where: {
                estado: true,
                id: id,
                puestoId: idPuesto
            }
        })
    }

    //si es null o 0 entonces no se encontro
    if (!candidato || candidato.length <= 0) {
        req.flash("errors", "Error al tratar de guardar el candidato, intente de nuevo")
        return res.redirect("/votar-candidato/" + idPuesto)
    }

    //verificar si no se ha votado por este puesto
    const verifVoto = await Votos.findAll({
        where: {
            ciudadanoId: req.session.user.id,
            puestoId: idPuesto,
            eleccionId: req.session.eleccion.id
        }
    })

    if (!verifVoto || verifVoto.length <= 0) {
        //si no se ha votado se guarda el voto
        const voto = {
            eleccionId: req.session.eleccion.id,
            ciudadanoId: req.session.user.id,
            candidatoId: id,
            puestoId: idPuesto
        }

        Votos.create(voto)
            .then(r => {
                res.redirect("/votar");
            })
            .catch(err => {
                console.log(err)
                req.flash("errors", "Ha ocurrido un error interno al tratar de guardar su voto, contacte con el administrador de su sector")
                res.redirect("/votar")
            })
    } else {
        //en caso de que ya se haya votado por ese puesto
        req.flash("errors", "Error, ya ha votado por ese puesto")
        return res.redirect("/votar")
    }
}

//finalizar votacion y enviar email
exports.PostFinishVotes = async (req, res, next) => {
    //datos del ciudadano y de las elecciones actuales
    const ciudadano = req.session.user
    const elecciones = req.session.eleccion

    //se buscan los votos del ciudadano
    const votaciones = (await Votos.findAll({
        where: {
            ciudadanoId: ciudadano.id,
            eleccionId: elecciones.id
        },
        include: [Puesto, Candidato]
    })).map(v => v.dataValues)

    //se construye el cuerpo del email
    let body = `
    Estimado/a Sr/a <strong>${ciudadano.nombre} ${ciudadano.apellido}</strong><br><br>

    Gracias por utilizar nuestro sistema de votaciones online, esta es su seleccion de la votacion <strong>"${elecciones.nombre}"</strong><br><br>
    <ul>
    `;
    //se itera por cada votacion y se crea la lista de cada puesto con su candidato elegido
    votaciones.forEach(v => {
        body += `<li><strong>${v.puesto.dataValues.nombre}: </strong>${v.candidato.dataValues.nombre} ${v.candidato.dataValues.apellido}</li>`
    })
    body += `
    </ul>
    <br><br>
    Mensaje generado de forma automatica
    `;

    //se configura y envia el email
    emailService.sendMail({
        from: "Leonel Fernandez APP",
        to: ciudadano.email,
        subject: 'Seleccion de votaciones',
        html: body
    },
        err => console.log(err));

    //se cierra la sesion manualmente y se redirige al login
    await req.session.destroy()
    res.redirect("/");
}