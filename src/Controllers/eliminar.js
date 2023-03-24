const conex = require('./ControladoBd');
const sql = require('mssql');

async function eliminarCohorte(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now(); 
                var datosUsuario = global.SesionU;

                const codigo = req.params.codigo;
                const visible = 'no';
                const pool = await conex.getConnection();

                await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .input('visible', sql.VarChar, visible)
                    .query(
                        'UPDATE cohorte SET visible = @visible where codigo=@codigo');
                        const pool2 = await conex.getConnection();
                        const result2 = await pool2.request().query("select * from Configuracion_cohorte where visible = 'si'")
                        const query_cohorte1 = result2.recordset;
        
        
                        const pool3 = await conex.getConnection();
                        const result3 = await pool3.request().query
                            ("select * from cohorte where visible = 'si' ")
                        const query_cohorte = result3.recordset;
        

                    return res.render('confiCohorte', { datosUsuario,query_cohorte1,query_cohorte })             
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

async function eliminarCampos(req, res) {
    try {
        if (req.session.user) {
            if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
                req.session.user.lastVisit = Date.now();
                var datosUsuario = global.SesionU;
                const codigo = req.params.codigo;
                const visible = 'no';
                const pool = await conex.getConnection();

                await pool
                    .request()
                    .input('codigo', sql.BigInt, codigo)
                    .input('visible', sql.VarChar, visible)
                    .query(
                        'UPDATE Configuracion_cohorte SET visible = @visible where codigo=@codigo');
                        
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


}


module.exports = {
    eliminarCohorte: eliminarCohorte,
    eliminarCampos: eliminarCampos
}

