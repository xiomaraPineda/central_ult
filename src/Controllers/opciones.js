const m = require("./mongodb");
const request = require("request");
const axios = require("axios");
const XLSX = require('xlsx')
const conex = require('./ControladoBd');



function inicio(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                let tituloP = " A filtros"
                datosUsuario[0].tituloP = tituloP;
                res.render("procesos/filtros", { datosUsuario })
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



function filtro(req, res) {

    try {
        let cohort = req.body.coho;
        let sed = req.body.sed;
        //____________||New Date________________________________________________
        let fInicio = (req.body.fIni);
        let fFinal = (req.body.fFin);
        let identifi = req.body.iden;
        fInicio = fInicio + "T" + "00:00:00";
        fFinal = fFinal + "T" + "00:00:00";

        m.db.once('open', function () {
        });

        if (identifi != '') {
            // Obtener una referencia a la colección
            const collection = m.db.collection('Usuarios');
            // Buscar documentos donde el campo `field` es igual a `value`
            collection.find({ hidentificacion: identifi }, { projection: { _id: 0 } }).toArray(function (err, docs) {
                if (err) throw err;

                try {
                    if (req.session.user) {
                        if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                            req.session.user.lastVisit = Date.now();
                            // var datosUsuario = global.SesionU;

                            res.send({ docs })
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
                };
            });
        }
        else {
            if (cohort != '' && sed != '') {
                if (cohort == 'todas' && sed != 'todas') {
                    const collection = m.db.collection('Usuarios');
                    collection.find({
                        hSede: sed,
                        hFechaGestion: { $gte: fInicio, $lte: fFinal }
                    }, { projection: { _id: 0 } }).toArray(function (err, docs) {
                        if (err) throw err;


                        try {
                            if (req.session.user) {
                                if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                                    req.session.user.lastVisit = Date.now();
                                    // var datosUsuario = global.SesionU;

                                    res.send({ docs })
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
                        };

                        // res.send({ docs })
                    });
                }
                else {
                    if (cohort != 'todas' && sed == 'todas') {
                        const collection = m.db.collection('Usuarios');
                        collection.find({
                            hCodigo: cohort,
                            hFechaGestion: { $gte: fInicio, $lte: fFinal }
                        }, { projection: { _id: 0 } }).toArray(function (err, docs) {
                            if (err) throw err;
                            try {
                                if (req.session.user) {
                                    if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                                        req.session.user.lastVisit = Date.now();
                                        // var datosUsuario = global.SesionU;

                                        res.send({ docs })
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
                            };
                        });
                    }
                    else {
                        if (sed == 'todas' && cohort == 'todas') {
                            const collection = m.db.collection('Usuarios');
                            collection.find({
                                hFechaGestion: { $gte: fInicio, $lte: fFinal }
                            }, { projection: { _id: 0 } }).toArray(function (err, docs) {
                                if (err) throw err;
                                try {
                                    if (req.session.user) {
                                        if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                                            req.session.user.lastVisit = Date.now();
                                            // var datosUsuario = global.SesionU;

                                            res.send({ docs })
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
                                };
                            });
                        }
                        else {
                            const collection = m.db.collection('Usuarios');
                            collection.find({
                                $and: [{
                                    hFechaGestion: { $gte: fInicio, $lte: fFinal }
                                },
                                { hSede: sed },
                                { hCodigo: cohort }
                                ]
                            }, { projection: { _id: 0 } }).toArray(function (err, docs) {
                                if (err) throw err;
                                try {
                                    if (req.session.user) {
                                        if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                                            req.session.user.lastVisit = Date.now();
                                            // var datosUsuario = global.SesionU;

                                            res.send({ docs })
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
                                };
                            });
                        }
                    }

                }
            }
        }
    }
    catch (err) {
        console.log(err);

    }


}

const requestPromise = (options) => {
    return new Promise((resolve, reject) => {
        request(options, function (error, response) {
            if (error) {
                reject(error);
            } else {
                resolve(JSON.parse(response.body));
            }
        });
    });
}

async function sedes(req, res) {
    var options = {
        'method': 'GET',
        'url': `http://190.0.47.182:7077//ApiRecursosGesis/api/Sede`,
        'headers': {
            'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
        }
    };

    try {
        const Sedes = await requestPromise(options);
        const pool1 = await conex.getConnection();
        const result1 = await pool1.request().query("select * from cohorte where visible = 'si' ");
        const query_cohorte1 = result1.recordset;

        res.send({ Sedes, query_cohorte1 });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener las sedes');
    }
}



module.exports = {
    filtro: filtro,
    inicio: inicio,
    sedes: sedes
}