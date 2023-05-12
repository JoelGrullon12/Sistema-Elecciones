const { DataTypes } = require("sequelize");
const sql = require("./../utils/database");

const Candidato = sql.define("candidato", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    partidoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    puestoId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    estado: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    
});

module.exports = Candidato;