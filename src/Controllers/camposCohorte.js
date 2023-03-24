const express = require('express');
const { pool } = require('mssql');
const conex = require('./ControladoBd');
const sql = require('mssql');
const { datos } = require('./editar');


// registrar 

async function consultains(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const pool = await conex.getConnection();
                const result = await pool.request().query
                    ("select * from Configuracion_cohorte where visible='si' ")
                const query_confi = result.recordset;
                return res.render('cohortecampo', { query_confi, datosUsuario });
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

};


async function insert2(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const { cohorte, campo, tipodato, tipo, valor1 } = req.body;
                let idusuario = '1001546022';
                let estado = 'si';
                //codigo uni
                //objeto nuevo Date
                var today = new Date();
                /* obtener la fecha y la hora ára pasarla al codigo y así poder cambiar el codigo de la cohorte actual cambiar la visibilidad del registro y volver a incertar un registro modificado */
                var now = today.toLocaleString() + today.getMilliseconds();
                //remplar los valores con los que llega la fecha y la hora 
                now = now.replace('/2023', '/23');
                now = now.replace('/', '');
                now = now.replace('/', '');
                now = now.replace(':', '');
                now = now.replace(':', '');
                now = now.replace(' ', '');
                now = now.replace('p', '');
                now = now.replace('m', '');
                now = now.replace('a', '');
                now = now.replace('.', '');
                now = now.replace('.', '');
                now = now.replace('.', '');
                now = now.replace(',', '');
                now = now.replace(/\s+/g, '');
                const codigoCohorteUpdate = now;

                try {
                    const pool = await conex.getConnection();
                    await pool
                        .request()
                        .input('codigo', sql.BigInt, codigoCohorteUpdate)
                        .input('cohorte', sql.BigInt, cohorte)
                        .input('campo', sql.VarChar, campo)
                        .input('tipodato', sql.VarChar, tipodato)
                        .input('tipo', sql.VarChar, tipo)
                        .input('valor', sql.VarChar, valor1)
                        .input('estado', sql.VarChar, estado)
                        .input('IdUsuario', sql.VarChar, idusuario)
                        .input('visible', sql.VarChar, estado)
                        .query('INSERT INTO Configuracion_cohorte VALUES (@codigo,@cohorte,@campo,@tipodato,@tipo,@valor,@estado,@IdUsuario, @visible)');

                    let datos = [
                        ["Estado", "Guardado"]
                    ]


                    const pool3 = await conex.getConnection();
                    const result3 = await pool3.request().query
                        ("select * from cohorte where visible = 'si' ")
                    const query_cohorte = result3.recordset;


                    const pool1 = await conex.getConnection();
                    const result1 = await pool1.request().query
                        ("select * from Configuracion_cohorte where visible = 'si' ")
                    const query_cohorte1 = result1.recordset;


                    return res.render('confiCohorte', { datos, query_cohorte, query_cohorte1, datosUsuario });

                }
                catch (error) {

                    let datos = [
                        ["Estado", "NoGuardo"]
                    ]

                    return res.render('confiCohorte', { datos, datosUsuario });


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

async function consultarCohorte(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                let campo = req.query.coho;
                const pool = await conex.getConnection();
                const result = await pool.request().query
                    (`select * from Configuracion_cohorte where visible='si' AND cohorte = ${campo}`)
                const query_cohorte1 = result.recordset;
                return res.send({ query_cohorte1: query_cohorte1, datosUsuario });
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
    consultains: consultains,
    insert2: insert2,
    consultarCohorte: consultarCohorte
}