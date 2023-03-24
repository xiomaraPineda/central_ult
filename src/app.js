//Importación de librerias
const express = require("express");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const rutas = require("./routes/rutas");
var session = require('express-session');
const colors = require("colors");
const { patch } = require("request");
const rutac = require("path")
const handlebars = require("handlebars")
const ges = require('./Controllers/gestion')


//Declaraciones del servidor
const app = express();
app.use(express.static('public'));
app.set('port', 8040);

//Sesion
app.use(session({
  secret: 'secretKey',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 600 * 1000  // sesión válida por 10 minuto
  }
}));


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

//Definicion de la vista y gestor de paginas maestras
handlebars.registerHelper('eq', function (a, b) {
  return a == b;
})
handlebars.registerHelper('ineq', function (a, b) {
  return a != b;
})

app.set('views', __dirname + '/views');
app.engine('.hbs', engine({
  extname: '.hbs'
})
);
app.set('view engine', 'hbs')

app.use(express.static(rutac.join(__dirname, 'public')));

//Inicio del servidor
app.listen(app.get('port'), () => {

  // console.log("Listening in port ", app.get('port'));
})

app.use('/', rutas);

//definición de enrutamiento
app.use('/', rutas);
global.SesionU = {}
global.Usuario = ""
global.Datos = "";


//app.use(express.urlencoded({ extended: true }));
//definición ruta de inicio

//app.use(express.urlencoded({ extended: true }));



// app.post('layouts/main.hbs', (req, res) => {
//   res.body('')
// });

app.use(express.json());


