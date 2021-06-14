const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//Importo las variables de entorno
require ('dotenv').config({ path: 'variables.env'});

//Importo el modelo 
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

//Creo la conexcion a la DB
const db = require('./config/db');

//Conecta y crea las tablas en caso de que no existan
db.sync()
.then( () => console.log('Conectado a la DB...'))
.catch( error => console.log(error) )

const app = express();

//Defino de donde cargar los archivos estaticos
app.use(express.static('public'));

//habilito PUG
app.set('view engine', 'pug');

//habilito body parser
app.use(bodyParser.urlencoded({ extended: true }));

//Agrego flash messages
app.use(flash());

app.use(cookieParser());

// las sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

app.use( passport.initialize());
app.use( passport.session());

//Paso el vardump de herlpers a la app
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = { ...req.user } || null;    
    next();
});

//Defino la ruta de las vistas
app.set('views', path.join(__dirname, './views'));

app.use('/', routes());

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;

app.listen(port, host, () => {
    console.log('Servidor corriendo...');
});