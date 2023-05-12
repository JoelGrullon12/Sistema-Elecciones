const express = require("express");
const { engine } = require('express-handlebars');
const path = require("path");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const session = require("express-session");
const flash = require("connect-flash");
const bcrypt = require("bcryptjs");

const auth = require("./middlewares/auth")
const seed = require("./utils/seeds")
const userTypes = require("./utils/userTypes")

const app = express();
const port = 3000;

const errorController = require('./controllers/errorController');

const compareHelpers = require('./utils/helpers/hbs/comparar')


const homeRouter = require("./routes/home");

const sequelize = require("./utils/database");
const Candidato = require("./models/Candidato");
const Ciudadano = require("./models/Ciudadano");
const Eleccion = require("./models/Eleccion");
const Partido = require("./models/Partido");
const Puesto = require("./models/Puesto");
const Usuario = require("./models/Usuario");
const Voto = require("./models/Voto");

app.engine('hbs', engine({
    layoutsDir: 'views/layouts/',
    defaultLayout: 'main-layout',
    extname: 'hbs',
    helpers: {
        equalValue: compareHelpers.EqualValue,
        mayorQue: compareHelpers.MayorQue,
        menorQue: compareHelpers.MenorQue,
    },
}));

app.set('view engine', 'hbs');
app.set('views', './views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/images", express.static(path.join(__dirname, "images")));

app.use(session({
    secret: "dromedarios",
    resave: true,
    saveUninitialized: false
}))

app.use(flash())

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.session.isLoggedIn
    res.locals.isAdmin = req.session.userType == userTypes.Admin
    res.locals.isCiudadano = req.session.userType == userTypes.Ciudadano
    res.locals.isEleccion = req.session.isEleccion
    if (req.session.isEleccion && req.session.userType == userTypes.Admin) {
        req.flash("errors", "Votacion activa actualmente, se han limitado algunas opciones del sistema")
    }
    res.locals.errors = req.flash("errors")
    next();
})

const imageStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, `${uuidv4()}-${file.originalname}`);
    },
});

app.use(multer({ storage: imageStorage }).single("Image"));

app.use(seed.SeedsAdmin)
app.use(seed.SeedsCiudadano)
app.use(seed.SeedsPuesto)
app.use(seed.SeedsPartido)
app.use(seed.SeedsCandidato)

const partidosRouter = require('./routes/partidos');
const puestosRouter = require('./routes/puestos');
const candidatosRouter = require('./routes/candidatos');
const eleccionesRouter = require('./routes/elecciones');
const voteRouter = require('./routes/vote');
const ciudadanosRouter = require('./routes/ciudadanos');

app.use(partidosRouter);
app.use(puestosRouter);
app.use(candidatosRouter);
app.use(eleccionesRouter);
app.use(voteRouter);
app.use(ciudadanosRouter);

app.use(homeRouter);
app.use("/", errorController.Get404);

//Establishing the relationships
Partido.hasMany(Candidato)
Candidato.belongsTo(Partido)

Puesto.hasMany(Candidato)
Candidato.belongsTo(Puesto)

Eleccion.hasMany(Voto)
Voto.belongsTo(Eleccion)

Candidato.hasMany(Voto)
Voto.belongsTo(Candidato)

Puesto.hasMany(Voto)
Voto.belongsTo(Puesto)

Ciudadano.hasMany(Voto)
Voto.belongsTo(Ciudadano)

sequelize.sync().then(result => {
    console.log("Database synced");
    app.listen(port, () => {
        console.log(`App runnig in port: ${port}`);
    });
}).catch(err => {
    console.log("Error syncing the database");
    console.log(err);
});

