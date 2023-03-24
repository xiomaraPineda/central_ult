const bodyParser = require("body-parser");
const express = require('express');
const { pool } = require('mssql');
const conex = require('./ControladoBd');
const sql = require('mssql');

const app = express();


//llamar datos a la vista 
async function datosCohorte(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                var codigo = req.params.codigo;
                const pool = await conex.getConnection();
                const result = await pool.request().query(`select * from cohorte where codigo= ${codigo} and visible='si'`)

                const query_cohorte = result.recordset;
                return res.render('editarCohorte', { query_cohorte, datosUsuario });
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


async function actuaCohorte(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const codigo = req.params.codigo;
                const pool = await conex.getConnection();

                const queryCohorteByCodigo = await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .query("SELECT * FROM cohorte where codigo = @codigo and visible = 'si'");

                const consultaCohorteById = queryCohorteByCodigo.recordset;
                return res.render('/editarCohorte', { queryCohorteByCodigo, consultaCohorteById, datosUsuario });
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
//editar las cohorte
async function actualizarCohorte(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const pool = await conex.getConnection();

                const codigo = req.body.codigo;
                const Nombre = req.body.Nombre;
                const crterios_cohorte = req.body.crterios_cohorte
                const estado = req.body.estado

                let visible = 'si'
                let visibleno = 'no'
                await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .input('visibleno', sql.VarChar, visibleno)
                    .query(`UPDATE cohorte SET  visible = @visibleno where codigo = @codigo`)

                await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .input('Nombre', sql.VarChar, Nombre)
                    .input('crterios_cohorte', sql.VarChar, crterios_cohorte)
                    .input('estado', sql.VarChar, estado)
                    .input('visible', sql.VarChar, visible)
                    .query(
                        'INSERT INTO cohorte VALUES (@codigo,@Nombre,@crterios_cohorte,@estado,@visible)');

                // llamar los datos a la vista, de la tabla cohorte 
                const pool1 = await conex.getConnection();
                const result = await pool1.request().query
                    ("select * from cohorte where visible = 'si'")
                const query_cohorte = result.recordset;

                const pool2 = await conex.getConnection();
                const result2 = await pool2.request().query("select * from Configuracion_cohorte where visible = 'si'")
                const query_cohorte1 = result2.recordset;

                return res.render('confiCohorte', { query_cohorte, query_cohorte1, datosUsuario })
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


    // return res.redirect('/')
}


// campos cohorte
//llamar datos a la vista 
async function datosCampos(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                var codigo = req.params.codigo;
                const pool = await conex.getConnection();
                const resultado = await pool.request().query(`select * from Configuracion_cohorte where codigo= ${codigo} and visible='si'`)

                const query_cohorte1 = resultado.recordset;
                return res.render('editarCampos', { query_cohorte1, datosUsuario });
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

async function actuaCampos(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const codigo = req.params.codigo;
                const pool = await conex.getConnection();

                const queryCampoByCodigo = await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .query("SELECT * FROM Configuracion_cohorte where codigo = @codigo and visible = 'si'");

                const consultaCampoById = queryCampoByCodigo.recordset;
                return res.render('/editarCampos', { queryCampoByCodigo, consultaCampoById, datosUsuario });
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

//editar los campos de la cohorte

async function editarcampo(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const pool = await conex.getConnection();

                const codigo = req.body.codigo;
                const cohorte = req.body.cohorte;
                const campo = req.body.campo;
                const tipodato = req.body.tipodato;
                const tipo = req.body.tipo;
                const valor = req.body.valor;
                const estado = req.body.estado;
                const IdUsuario = req.body.IdUsuario;

                let visible = 'si'
                let visibleno = 'no'
                await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .input('visibleno', sql.VarChar, visibleno)
                    .query(`UPDATE Configuracion_cohorte SET  visible = @visibleno where codigo = @codigo`)

                await pool
                    .request()
                    .input('cohorte', sql.VarChar, cohorte)
                    .input('codigo', sql.BigInt, codigo)
                    .input('campo', sql.VarChar, campo)
                    .input('tipodato', sql.VarChar, tipodato)
                    .input('tipo', sql.VarChar, tipo)
                    .input('valor', sql.VarChar, valor)
                    .input('estado', sql.VarChar, estado)
                    .input('IdUsuario', sql.VarChar, IdUsuario)
                    .input('visible', sql.VarChar, visible)
                    .query(
                        'INSERT INTO Configuracion_cohorte VALUES (@codigo,@cohorte,@campo,@tipodato,@tipo,@valor,@estado,@IdUsuario,@visible)');

                //llamar la tabla Configuracion_cohorte a la vista 
                const pool2 = await conex.getConnection();
                const result2 = await pool2.request().query("select * from Configuracion_cohorte where visible = 'si'")
                const query_cohorte1 = result2.recordset;


                const pool3 = await conex.getConnection();
                const result3 = await pool3.request().query
                    ("select * from cohorte where visible = 'si' ")
                const query_cohorte = result3.recordset;


                return res.render('confiCohorte', { query_cohorte, query_cohorte1, datosUsuario })

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
    datosCohorte: datosCohorte,
    actuaCohorte: actuaCohorte,
    actualizarCohorte: actualizarCohorte,
    datosCampos: datosCampos,
    editarcampo: editarcampo,
    actuaCampos: actuaCampos,
    
}