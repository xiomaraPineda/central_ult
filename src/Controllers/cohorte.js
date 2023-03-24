const { request, Router } = require('express');
const express = require('express');
const { pool } = require('mssql');
const conex = require('./ControladoBd');
const sql = require('mssql');
const bodyParser = require("body-parser");



//registrar 

async function cohorte1(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                let tituloP = " A configuración de las cohortes"
                datosUsuario[0].tituloP = tituloP;

                const pool = await conex.getConnection();
                const result = await pool.request().query
                    ("select * from cohorte where visible = 'si' ")
                const query_cohorte = result.recordset;

                const pool1 = await conex.getConnection();
                const result1 = await pool1.request().query
                    ("select * from Configuracion_cohorte where visible = 'si' ")
                const query_cohorte1 = result1.recordset;

                return res.render('confiCohorte', { query_cohorte, query_cohorte1, datosUsuario });
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

async function cohorte2(req, res) {

    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                console.log(req.body)
                const codigo = req.body.codigo
                const Nombre = req.body.Nombre
                const crterios_cohorte = req.body.crterios_cohorte
                const estado = req.body.estado
                const visible = req.body.Visible

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
                        .input('Nombre', sql.VarChar, Nombre)
                        .input('crterios_cohorte', sql.VarChar, crterios_cohorte)
                        .input('estado', sql.VarChar, estado)
                        .input('visible', sql.VarChar, visible)
                        .query(
                            'INSERT INTO cohorte VALUES (@codigo,@Nombre,@crterios_cohorte,@estado,@visible)'
                        );

                    let datos = [
                        ["Estado", "Guardado"]
                    ]

                    const pool1 = await conex.getConnection();
                    const result = await pool1.request().query
                        ("select * from cohorte where visible = 'si' ")
                    const query_cohorte = result.recordset;
                    return res.render('confiCohorte', { query_cohorte, datosUsuario });



                } catch (error) {

                    let datos = [
                        ["Estado", "NoGuardo"]
                    ]

                    return res.render('confiCohorte', { datos, datosUsuario });
                    //return res.send({cohorte});
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




};




module.exports = {
    cohorte1: cohorte1,
    cohorte2: cohorte2

}