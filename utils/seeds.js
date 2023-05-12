const bcrypt = require("bcryptjs")
const Usuario = require("../models/Usuario")
const Ciudadano = require("../models/Ciudadano")
const Puesto = require("../models/Puesto")
const Partido = require("../models/Partido")
const Candidato = require("../models/Candidato")

exports.SeedsAdmin = async (req, res, next) => {
    const adminUser = await Usuario.findOne({
        where: {
            username: "AdminUser"
        }
    })

    if (!adminUser) {
        const newAdmin = {
            nombre: "Admin",
            apellido: "User",
            email: "adminuser@email.com",
            username: "AdminUser",
            password: await bcrypt.hash("Pa$$word123!", 12),
            estado: true
        }
        await Usuario.create(newAdmin);
    }

    next()
}

exports.SeedsCiudadano = async (req, res, next) => {
    const ciudadanoUser = await Ciudadano.findOne({
        where: {
            cedula: "001-2345678-9"
        }
    })

    if (!ciudadanoUser) {
        const newCiudadano = {
            cedula: "001-2345678-9",
            nombre: "John",
            apellido: "Doe",
            email: "djohn@gmail.com",
            estado: true
        }
        await Ciudadano.create(newCiudadano);
    }

    next()
}

exports.SeedsPuesto = async (req, res, next) => {
    const findPuesto = await Puesto.findOne({
        where: {
            id: 0
        }
    })

    if (!findPuesto) {
        let newPuesto = {
            nombre: "Ninguno",
            descripcion: "Ninguna",
            estado: false
        }
        console.log(newPuesto)

        newPuesto = (await Puesto.create(newPuesto)).dataValues
        console.log(newPuesto)
        const newId = newPuesto.id;
        newPuesto.id = 0;
        console.log(newPuesto)

        await Puesto.update(newPuesto, {
            where: {
                id: newId
            }
        })
    }

    next();
}

exports.SeedsPartido = async (req, res, next) => {
    const findPartido = await Partido.findOne({
        where: {
            id: 0
        }
    })

    if (!findPartido) {
        let newPartido = {
            nombre: "Ninguno",
            descripcion: "Ninguna",
            logoUrl: "/assets/img/ninguno.png",
            estado: false
        }

        newPartido = (await Partido.create(newPartido)).dataValues
        const newId = newPartido.id
        newPartido.id = 0

        await Partido.update(newPartido, {
            where: {
                id: newId
            }
        })
    }

    next();
}

exports.SeedsCandidato = async (req, res, next) => {
    const findCandidato = await Candidato.findOne({
        where: {
            id: 0
        }
    })

    if (!findCandidato) {
        let newCandidato = {
            nombre: "Ningun",
            apellido: "Candidato",
            puestoId: 0,
            partidoId: 0,
            imgUrl: "/assets/img/ninguno.png",
            estado: false
        }

        newCandidato = (await Candidato.create(newCandidato)).dataValues
        const newId = newCandidato.id
        newCandidato.id = 0

        await Candidato.update(newCandidato, {
            where: {
                id: newId
            }
        })
    }

    next();
}