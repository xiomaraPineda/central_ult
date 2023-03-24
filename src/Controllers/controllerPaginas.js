const { getConnection } = require('./ControladoBd');
const { size } = require('lodash');
const m = require("./mongodb");
const bodyParser = require("body-parser");
var request = require('request');
const { resolve } = require('path');
const { default: axios } = require('axios');
const { datos_fecha_gestion } = require('./datosUltimaGestion');
const { response } = require('express');
const con = require('./control');
const afi = require('./afiliados');
// const { archivoGest } = require('./gestion')
const conex = require('./ControladoBd');
const sql = require('mssql');


var dat_ul;
var Identificacion = "";
var cohorte_ = ""

function datos_atenciones_apis(req, res, id) {

    // archivoGest()

    if (req.body.id) {
        try {
            Identificacion = req.body.id;
        }
        catch
        {
            Identificacion = id
        }
    }
    else {
        Identificacion = id
    }
    global.Usuario = "";

    function atenciones_paciente() {
        return new Promise((resolve, reject) => {
            var options = {
                'method': 'GET',
                'url': `http://10.91.20.27//ApiRecursosGesis/api/ApiAtencionesUsuario?Identificacion=${Identificacion}`,
                'headers': {
                    'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
                }
            };

            request(options, function (error, response) {
                if (error) {
                    reject(error);
                }
                let USuario = data = JSON.parse(response.body);
                resolve(USuario);
            });
        });
    }

    function datos_paciente() {
        return new Promise(async (resolve, reject) => {

            var option = {
                'method': 'GET',
                'url': `http://10.91.20.27/ApiRecursosGesis/api/ApiUsuario/?Identificacion=${Identificacion}`,
                'headers': {
                    'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
                }

            };

            request(option, function (error, response) {

                if (error) {
                    let datosUsuario = [
                        { error: "No se puede consultar el usuario por fallas en la conexión, contacte al administrador del sistema." }
                    ];

                    resolve(datosUsuario);
                }
                let datosUsuario = data = JSON.parse(response.body);


                if (datosUsuario.length >= 1) {
                    let datosUsuario_1 = data = JSON.parse(response.body);

                    resolve(datosUsuario_1);
                }
                else {
                    if (datosUsuario.length == 0) {
                        let datosUsuario_1 = [
                            { error: "El usuario no se encuentra en la lista de atenciones, por favor validé la identificación" },

                        ]

                        resolve(datosUsuario_1);
                    }
                }

            });
        });
    }

    function cohorte(Identificacion) {
        return new Promise((resolve, reject) => {
            m.db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
            m.db.once('open', function () {
                //console.log('Conexión a MongoDB exitosa');
            });
            // Obtener una referencia a la colección
            const collection = m.db.collection('Usuarios');
            collection.find({ "hidentificacion": Identificacion }).toArray(function (err, docs) {
                if (err) { reject(err) }

                let datos = docs;


                if (datos.length > 0) {

                    resolve(datos);

                } else {
                    let datos = "";
                    resolve(datos)
                }

            });
        })
    }


    async function lista_() {
        return new Promise(async (resolve, reject) => {
            try {
                const pool = await getConnection();
                // const cod_cohortes = await pool.request().query("select * from cohorte where visible= 'si'")
                const cod_cohortes = await pool.request().query("select * from cohorte where visible= 'si'")
                const lista_coho = cod_cohortes.recordset;

                resolve(lista_coho)
            } catch (error) {
                reject(error);
            }
        });

    }



    Promise.all([atenciones_paciente(), datos_paciente(), cohorte(Identificacion), lista_(), afi.verAfiliados(Identificacion)])
        .then(values => {
            try {
                if (req.session.user) {
                    if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                        req.session.user.lastVisit = Date.now();
                        var datosUsuario = global.SesionU;
                        let [resultado_api_1, resultado_api_2, datos, lista_coho, afiliados] = values;

                        for (let i = 0; i < datos.length; i++) {
                            const cohorte = datos[i];
                            for (const prop in cohorte) {
                                if (cohorte.hasOwnProperty(prop) && prop !== 'id') {
                                    let value = cohorte[prop];
                                    if (!isNaN(Date.parse(value))) {
                                        if (value.toString().includes("-")) {
                                            let date = new Date(value);
                                            if (isValidDate(date)) {
                                                let dia = date.getDate().toString().padStart(2, '0');
                                                let mes = (date.getMonth() + 1).toString().padStart(2, '0');
                                                let anio = date.getFullYear();
                                                let formattedDate = dia + "/" + mes + "/" + anio;
                                                cohorte[prop] = formattedDate;

                                            }

                                        }
                                    }

                                }
                            }
                        }
                        function isValidDate(dateString) {
                            let date = dateString;
                            return !isNaN(date.getTime());
                        }

                        for (let i = 0; i < resultado_api_1.length; i++) {
                            const resapi = resultado_api_1[i];
                            for (const prop in resapi) {
                                if (resapi.hasOwnProperty(prop) && prop !== 'id' && prop !== 'EdadCitaAnios') {
                                    let value = resapi[prop];
                                    if (!isNaN(Date.parse(value))) {
                                        let date = new Date(value);
                                        let dia = date.getDate().toString().padStart(2, '0');
                                        let mes = (date.getMonth() + 1).toString().padStart(2, '0');
                                        let anio = date.getFullYear();
                                        let formattedDate = dia + "/" + mes + "/" + anio;
                                        resapi[prop] = formattedDate;
                                    }
                                }
                            }
                        }

                        res.render('gestionCohortes', { resultado_api_1, resultado_api_2, datos, lista_coho, datosUsuario, afiliados })
                    }
                    else {
                        res.render("login", { layout: 'partials/empty' });
                    }
                }
                else {

                    res.render("login", { layout: 'partials/empty' });
                }
            }
            catch (error) {

                res.render("login", { layout: 'partials/empty' });
                console.log(error)
            }

        })
        .catch(error => {
            try {
                if (req.session.user) {
                    if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                        req.session.user.lastVisit = Date.now();
                        var datosUsuario = global.SesionU;
                        res.render('gestionCohortes', { datosUsuario })
                    }
                    else {
                        res.render("login", { layout: 'partials/empty' });
                    }
                }
                else {

                    res.render("login", { layout: 'partials/empty' });
                }
            }
            catch
            {

                res.render("login", { layout: 'partials/empty' });
            }

        });
}



async function paginaPrincipal(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                let tituloP = " A gestión de las cohortes"
                datosUsuario[0].tituloP = tituloP;

                if (global.Usuario != '') {
                    datos_atenciones_apis(req, res, global.Usuario);
                }
                else {
                    res.render("gestionCohortes", { datosUsuario });
                }

            }
            else {
                res.render("login", { layout: 'partials/empty' });
            }
        }
        else {

            res.render("login", { layout: 'partials/empty' });
        }
    }
    catch
    {

        res.render("login", { layout: 'partials/empty' });
    }

}

async function lista_gestion_cohortes(req, res) {
    cohorte_ = req.query.coho;
    async function listar_select(cohorte_) {

        return new Promise(async (resolve, reject) => {

            try {

                //console.log(cohorte_);
                const pool = await getConnection();
                const conf_cohortes = await pool.request().query(`SELECT * FROM Configuracion_cohorte WHERE cohorte = ${cohorte_} AND visible='si'`);
                const campos_cor = conf_cohortes.recordset;
                dat_ul = await datos_fecha_gestion(Identificacion, cohorte_)

                let condigoCont = await pool.request()
                    .input('cohorte', sql.BigInt, cohorte_)
                    .input('identificacion', sql.VarChar, Identificacion)
                    .query('SELECT * FROM controlRiesgo WHERE cohorte = @cohorte AND idUsuario = @identificacion');
                //const condigoCont = await pool.request().query(`SELECT * FROM controlRiesgo WHERE cohorte = ${cohorte_} AND idUsuario = ${Identificacion}`);
                let codigoControl = condigoCont.recordset;
                let mensaje;
                let noSePuede = "";
                let codig = 0;
                if (codigoControl == false) {
                    mensaje = "nobtn";
                }
                else {
                    let objetoM = codigoControl[0];
                    for (let i = 1; i < codigoControl.length; i++) {
                        if (codigoControl[i].codigoControl > objetoM.codigoControl) {
                            objetoM = codigoControl[i];
                        }
                    }

                    if (objetoM.estado == "cerrado" && (objetoM.cohorte == "152202315329998" || objetoM.cohorte == "152202315621636" || objetoM.cohorte == "152202320250885" || objetoM.cohorte == "152202320410987" || objetoM.cohorte == "152202320102178" || objetoM.cohorte == "152202314414483")) {
                        mensaje = "nobtn"
                        noSePuede = "No se puede insertar en esta cohorte porque ya estuvo en ella"
                    }
                    else {
                        if (objetoM.estado == "abierto") {
                            mensaje = "btn"
                            codig = objetoM.codigoControl;
                        }
                        else {
                            if (objetoM.estado == "cerrado") {
                                mensaje = "nobtn"
                            }
                            else {
                                mensaje = "nobtn"
                            }
                        }
                    }

                }
                codigoControl[0] = { mensaje: mensaje, noSePuede: noSePuede, codig: codig };

                const campos_cohorte_gestion = {
                    campos_cor,
                    dat_ul,
                    codigoControl
                }

                resolve(campos_cohorte_gestion);

            } catch (error) {
                console.error(error);
                campos_cohorte_gestion = "";
                resolve(campos_cohorte_gestion);
            }
        }
        );
    }

    Promise.all([listar_select(cohorte_)])
        .then(resultados => {
            const campos_cohorte_gestion = resultados[0];
            res.send(campos_cohorte_gestion);
        })
        .catch(error => {

            console.error(error);

        });
}



async function GuardarGestion(req, res) {

    try {
        if (req.session.user) {
            //llamando funcion control riesgo

            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                let codigoCont = await con.control(Identificacion, cohorte_);
                //codigoControl = JSON.stringify(codigoControl);
                const datosFormulario = req.body;
                datosFormulario.codigoControl = codigoCont;

                global.UsuarioCohorte = req.body.hidentificacion;
                m.db.collection('Usuarios').insertOne(datosFormulario, function (error, result) {
                    if (error) {
                        console.error(error);
                        res.status(500).send('Error al guardar los datos en la base de datos');
                    } else {
                        global.Usuario = req.body.hidentificacion;
                        res.redirect("/gestionCohorte");
                        // res.render("gestionCohorte","gestionCohortes",{datosUsuario});

                    }
                });
            }
            else {
                res.render("login", { layout: 'partials/empty' });
            }
        }
        else {

            res.render("login", { layout: 'partials/empty' });
        }
    }
    catch
    {

        res.render("login", { layout: 'partials/empty' });
    }


}




module.exports = {
    datos_atenciones_apis: datos_atenciones_apis,
    pagina_principal: paginaPrincipal,
    listar_select: lista_gestion_cohortes,
    GuardarGestion: GuardarGestion,
}