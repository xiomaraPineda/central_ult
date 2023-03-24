
//libreria para utilizar mongo (mongoose)
const mongoose = require('mongoose');

//coneccion a mongo con el url
mongoose.connect('mongodb://127.0.0.1:27017/CentralDeRiesgo', { useNewUrlParser: true });
mongoose.set('strictQuery', true);
//variable que guarda la conección
const db = mongoose.connection;

//abre la conección
db.once('open', () => {
    //console.log("conecto")
})

module.exports = {
    db: db
}

