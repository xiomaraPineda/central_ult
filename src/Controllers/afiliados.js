const sql = require('mssql');
const conex = require('./ControladoBd');


async function verAfiliados(iden) {
    return new Promise(async (resolve, reject) => {

        let datos = {}

        try {
            const pool = await conex.getConnection();
            const lisAfi = await pool.request().query(`select * from Afiliados where Identificacion = ${iden} and Estado= 'afiliado'`);
            const result = lisAfi.recordset;

            let datos = result;

            if (datos.length > 0) {

                resolve(datos);

            } else {
                let datos = "";
                resolve(datos)
            }
        }
        catch (error) {
            console.log(error)

        } finally {
            resolve(datos)
        }
    })
}



module.exports = {
    verAfiliados: verAfiliados
}