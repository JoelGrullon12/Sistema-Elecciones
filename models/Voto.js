const { DataTypes } = require("sequelize");
const sql = require("./../utils/database");

const Voto = sql.define("voto", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    eleccionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    ciudadanoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    candidatoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    puestoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
})

module.exports = Voto;