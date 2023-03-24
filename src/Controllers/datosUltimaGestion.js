const { resolve } = require("path");
const m = require("./mongodb");

var _id_ch;


function datos_fecha_gestion(identificacion, cohorte) {
    return new Promise(async (resolve, reject) => {
        try {
            m.db.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
            m.db.once('open', function () {
                console.log('Conexión a MongoDB exitosa');
            });

            m.db.collection('Usuarios').aggregate([
                {
                    $match: {
                        hidentificacion: identificacion,
                        hCodigo: cohorte,
                        hFechaGestion: { $exists: true, $type: "string" }

                    }
                },

                {
                    $addFields: {
                        parsedDate: {
                            $cond: {
                                if: { $regexMatch: { input: "$hFechaGestion", regex: /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/ } },
                                then: { $dateFromString: { dateString: "$hFechaGestion", format: "%Y-%m-%dT%H:%M:%S" } },
                                else: { $dateFromString: { dateString: "$hFechaGestion", format: "%d/%m/%Y" } }
                            }
                        }
                    }
                },
                { $addFields: { formattedDate: { $dateToString: { date: "$parsedDate", format: "%d/%m/%Y" } } } },

                { $sort: { parsedDate: -1 } },

                { $limit: 1 },

                { $project: { hFechaGestion: "$formattedDate", _id: 1, } }

            ]).toArray(async function (err, dat) {
                if (err) {
                    console.log(err);
                    reject(err);
                }

                else if (dat && dat.length > 0) {

                    _id_ch = dat[0]._id;

                    const collection = m.db.collection('Usuarios');

                    collection.find({ _id: _id_ch }).toArray(function (err, datos_gestion) {
                        if (err) { return (err) }

                        let datos_ultima = datos_gestion;

                        if (datos_ultima.length > 0) {

                            resolve(datos_ultima);

                        } else {
                            let datos_ultima = "";
                            resolve(datos_ultima)
                        }
                    })
                }
                else {

                    let datos_ultima = "";

                    resolve(datos_ultima)
                }
            });
        }
        catch (err) {
            console.log(err);
            reject(err);
        }
    }

    )
}


module.exports = {
    datos_fecha_gestion: datos_fecha_gestion,
};