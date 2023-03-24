const { model } = require("mongoose");
const sql = require('mssql');
const conex = require('./ControladoBd');


async function cerrarGestion(req, res) {

    try {

        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();

                let control = req.body.control;
                let estado = "cerrado";
                const pool = await conex.getConnection();
                let resultado = await pool.request()
                    .input('estado', sql.VarChar, estado)
                    .input('control', sql.BigInt, control)
                    .query(
                        'UPDATE controlRiesgo SET estado = @estado WHERE codigoControl = @control'
                    );
                if (resultado) {
                    let mensaje = ("Cerrado Exitoso");
                    return res.send({ mensaje })
                }
                else {
                    let mensaje = ("Fallo cerrar");
                    return res.send({ mensaje });
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
async function control(idUsuario, cohorte) {
    try {
        const pool = await conex.getConnection();
        const conf_control = await pool.request().query(`select * from controlRiesgo where idUsuario = ${idUsuario}`);
        const result = conf_control.recordset;

        let insertar;
        let resul = result;
        let codigocohorte = cohorte;
        let fechaControl = new Date().toDateString();
        let estado = "abierto"

        const result2 = await pool.request().query('SELECT TOP 1 * FROM controlRiesgo ORDER BY codigoControl DESC');
        insertar = result2.recordset[0];
        let codigoControl = insertar.codigoControl;

        if (resul.length == 0) {
            //si el registro no existe lo inserta y envia el codigo
            codigoControl = codigoControl + 1;
            await pool.request()
                .input('codigoControl', sql.Int, codigoControl)
                .input('idUsuario', sql.VarChar, idUsuario)
                .input('cohorte', sql.BigInt, cohorte)
                .input('estado', sql.VarChar, estado)
                .input('fechaControl', sql.Date, fechaControl)
                .query('INSERT INTO controlRiesgo (codigoControl, idUsuario, cohorte, estado, fechaControl ) VALUES (@codigoControl,@idUsuario, @cohorte,@estado,@fechaControl)');

        }
        else {
            let cons2 = await pool.request().query(`SELECT TOP 1 * FROM controlRiesgo WHERE idUsuario = ${idUsuario} AND cohorte = ${cohorte} ORDER BY Id DESC`);
            let resul2 = cons2.recordset[0];
            if (!resul2) {            //si el no existe
                if (codigocohorte == "152202315329998" || codigocohorte == "152202315621636" || codigocohorte == "152202320250885" || codigocohorte == "152202320410987" || codigocohorte == "152202320102178" || codigocohorte == "152202314414483") {
                    //cierra el que este abierto
                    let i = 0;
                    Object.values(result).forEach(item => {


                        if (result[i].estado == "abierto" && (result[i].cohorte == "152202315329998" || result[i].cohorte == "152202315621636" || result[i].cohorte == "152202320250885" || result[i].cohorte == "152202320410987" || result[i].cohorte == "152202320102178" || result[i].cohorte == "152202314414483")) {
                            let estadono = 'cerrado'
                            pool.request()
                                .input('codigoControl', sql.Int, result[i].codigoControl)
                                .input('estadono', sql.VarChar, estadono)
                                .input('usuario', sql.VarChar, idUsuario)
                                .query(`UPDATE controlRiesgo SET estado = @estadono where codigoControl=@codigoControl AND idUsuario = @usuario`)
                        }
                        i++
                    });
                    //inserta nuevo
                    codigoControl = codigoControl + 1;
                    await pool.request()
                        .input('codigoControl', sql.Int, codigoControl)
                        .input('idUsuario', sql.VarChar, idUsuario)
                        .input('cohorte', sql.BigInt, cohorte)
                        .input('estado', sql.VarChar, estado)
                        .input('fechaControl', sql.Date, fechaControl)
                        .query('INSERT INTO controlRiesgo (codigoControl, idUsuario, cohorte, estado, fechaControl ) VALUES (@codigoControl,@idUsuario, @cohorte,@estado,@fechaControl)');
                }
                else {
                    codigoControl = codigoControl + 1;
                    await pool.request()
                        .input('codigoControl', sql.Int, codigoControl)
                        .input('idUsuario', sql.VarChar, idUsuario)
                        .input('cohorte', sql.BigInt, cohorte)
                        .input('estado', sql.VarChar, estado)
                        .input('fechaControl', sql.Date, fechaControl)
                        .query('INSERT INTO controlRiesgo (codigoControl, idUsuario, cohorte, estado, fechaControl ) VALUES (@codigoControl,@idUsuario, @cohorte,@estado,@fechaControl)');
                }

            } else {                 //si el existe

                let cod = resul2.cohorte
                if (cod == "152202315329998" || cod == "152202315621636" || cod == "152202320250885" || cod == "152202320410987" || cod == "152202320102178" || cod == "152202314414483") {
                    if (resul2.estado == "abierto") {
                        //si el registro existe y esta habierto
                        codigoControl = resul2.codigoControl
                    }
                    else {
                        if (resul.estado == "cerrado") {
                        }
                    };
                }
                else {
                    if (resul2.estado == "abierto") {
                        codigoControl = resul2.codigoControl;

                    }
                    else {
                        if (resul.estado == "cerrado") {
                            codigoControl = codigoControl + 1;
                            await pool.request()
                                .input('codigoControl', sql.Int, codigoControl)
                                .input('idUsuario', sql.VarChar, idUsuario)
                                .input('cohorte', sql.BigInt, cohorte)
                                .input('estado', sql.VarChar, estado)
                                .input('fechaControl', sql.Date, fechaControl)
                                .query('INSERT INTO controlRiesgo (codigoControl, idUsuario, cohorte, estado, fechaControl ) VALUES (@codigoControl,@idUsuario, @cohorte,@estado,@fechaControl)');
                        }
                    };
                };

            }
        }


        return codigoControl;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


module.exports = {
    cerrarGestion: cerrarGestion,
    control: control
}


