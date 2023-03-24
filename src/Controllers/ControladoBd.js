const sql = require('mssql');
const path = require('path');



let config = {

  "user": 'sa',
  "password": "dprosalco1*",
  "server": '10.91.20.27',
  "database": 'CentralRiesgoBD',
  "port": 1434,
  "dialect": "mssql",
  "trustServerCertificate": true, "encrypt": false,
  "dialectOptions": {
    "instanceName": "DESARROLLO",
  }
};

let config_p = {

  "user": 'sa',
  "password": "Laura1sol*",
  "server": '10.91.20.27',
  "database": 'CentralRiesgoBD',
  "port": 1433,
  "dialect": "mssql",
  "trustServerCertificate": true, "encrypt": false,
  "dialectOptions": {
    "instanceName": "SQLEXPRESS",
  }
};


async function getConnection() {
  try {
    const pool = await sql.connect(config_p);

    return pool;
  } catch (error) {
    console.log(error);
  }
}



module.exports.getConnection = getConnection;


