const m = require("./mongodb");
const XLSX = require('xlsx')
const fs = require('fs');
const express = require('express');
const app = express();
const schedule = require('node-schedule');
const schedule = require('schedule')

let job = schedule.scheduleJob('20 16 * * *', archivoGest());

function cargar(req, res) {
    res.render('botonGestion')
}


async function archivoGest(req, res) {
    try {

        m.db.once('open', function () {
        });
        //obtener la coleccion
        const collection = m.db.collection('Usuarios')
        collection.find({}).toArray(function (err, docs) {
            if (err) throw err;
            // res.send({ docs })
            // console.log(collection.length)

            // Crear un objeto de tipo Worksheet de xlsx
            const worksheet = XLSX.utils.json_to_sheet(docs);
            // console.log(worksheet)
            // Obtener las claves únicas de los documentos
            const clavesUnicas = new Set();
            docs.forEach(doc => {
                //contiene las claves unicas y sus valores (desp de it el ciclo)
                const claves = Object.keys(doc);
                claves.forEach(clave => {
                    //agg clave
                    clavesUnicas.add(clave);
                    // console.log(clavesUnicas)
                });
            });

            // Convertir el conjunto de claves en un array y ordenarlo alfabéticamente
            const columnas = Array.from(clavesUnicas).sort();

            // Agregar las claves como títulos de columna al objeto de Worksheet
            // XLSX.utils.sheet_add_json(worksheet, docs, {
            //     header: columnas,
            //     skipHeader: true,
            //     origin: 'A1',
            // });


            // console.log(clavesArray)
            // Agregar las claves como títulos de columna al objeto de Worksheet
            const header = columnas.map(col => {
                return { v: col };
            });


            const headerRow = XLSX.utils.aoa_to_sheet([header]);
            // //referencia valida para la selda
            // worksheet['!ref'] = XLSX.utils.encode_range(headerRow['!ref'], worksheet['!ref']);

            //matriz de la columna 
            XLSX.utils.sheet_add_aoa(worksheet, [docs], { origin: 'A1' });
            // Iterar sobre los documentos y agregar los valores a las celdas correspondientes
            // docs.forEach(doc => {
            //     const valores = docs.map(col => doc[col] ?? '');
            //     XLSX.utils.sheet_add_aoa(worksheet, [valores]);
            // });
            const archivo = 'uploads/gestionUsuarios.xlsx';
            if (fs.existsSync(archivo)) {
                // Elimina el archivo
                fs.unlinkSync(archivo);
                console.log(`El archivo ${archivo} se ha eliminado exitosamente.`);
            } else {
                console.log(`El archivo ${archivo} no existe.`);
            }
            console.log(`Archivo eliminado.`);
            // Crear un objeto de tipo Workbook de xlsx y agregar el objeto de Worksheet
            //crear libro y agrgar la hoja
            const workbook = XLSX.utils.book_new();
            console.log(workbook);
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios');
            // Escribir el archivo de Excel en el sistema de archivos del servidor
            const filename = 'uploads/gestionUsuarios.xlsx';
            XLSX.writeFile(workbook, filename);
            // Leer el archivo y enviarlo como descarga al cliente
            res.send(" ");

        })
    } catch (error) {
        console.error(error);
        res.status(500).send('Ocurrió un error al generar el archivo.');
    }
}



function descargar(req, res) {
    const archivo = 'uploads/gestionUsuarios.xlsx';
    res.download(archivo);
};

function validar(req, res) {
    const archivo = 'uploads/gestionUsuarios.xlsx';
    fs.access(archivo, (error) => {
        if (error) {
            res.send("No")
        } else {
            res.send("Si")
        }
    })
};



module.exports = {
    archivoGest: archivoGest,
    cargar: cargar,
    descargar: descargar,
    validar: validar
} 