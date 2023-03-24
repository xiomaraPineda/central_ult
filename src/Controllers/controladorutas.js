const sql = require('mssql');
const path = require('path');
var request = require('request');
const conex = require('./ControladoBd');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const xlsx = require('xlsx');



function gestionCohorte(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;
        res.render("procesos/gestionCohorte", { datosUsuario })
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

function filtros(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;
        res.render("procesos/filtros", { datosUsuario })
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



function salir(req, res) {
  req.session.destroy();
  res.render("login", { layout: 'partials/empty' });
}

//api 
async function login(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;

        const poolx = await conex.getConnection();
        const resultx = await poolx.request().query
          (`select * from Afiliados`)
        const ListadoA = resultx.recordset
        //traer listado gestion
        const pool2 = await conex.getConnection();
        const result2 = await pool2.request().query
          (`select * from Gestion`)
        const ListadoG = result2.recordset
        let tituloP = " A inicio"
        datosUsuario[0].tituloP = tituloP;

        res.render("procesos/gestionCohorte", { datosUsuario, ListadoA, ListadoG })
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

async function ingresar(req, res) {
  const user = req.body.username;
  const contrasena = req.body.password;
  const salir = req.body.salir;
  if (typeof user != 'undefined' && contrasena != 'undefined') {
    //if (typeof salir === 'undefined') {
    // const user = req.body.username;
    // const contrasena = req.body.password;


    var option = {
      'method': 'GET',
      'url': `http://10.91.20.27/ApiRecursosGesis/api/EmpleadosSistema?Identificacion=${user}&Contrasena=${contrasena}`,
      'headers': {
        'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
      }
    };


    request(option, async function (error, response) {
      if (error) throw new Error('el dato no es valido');
      let datosUsuario = data = JSON.parse(response.body);

      if (datosUsuario.length > 0) {

        req.session.user = {
          username: datosUsuario[0].Identificacion,
          lastVisit: Date.now()

        };

        const pool1 = await conex.getConnection();
        let consulta = `select * from Roles where identificacion='${datosUsuario[0].Identificacion}'`;
        const result = await pool1.request().query(consulta)
        const query_rol = result.recordset;
        let rol = query_rol[0].rol;


        if (rol == 'Inactivo') {
          req.session.destroy();
          const error_ = [
            { error1: "Su usuario se encuentra inactivo, contacte al administrador" }]
          res.render("login", { error_, layout: 'partials/empty' });
        }

        for (let y = 0; y < datosUsuario.length; y++) {
          datosUsuario[y].rol = rol;
          break;
        }

        const poolx = await conex.getConnection();
        const resultx = await poolx.request().query
          (`select * from Afiliados`)
        const ListadoA = resultx.recordset
        //traer listado gestion
        const pool2 = await conex.getConnection();
        const result2 = await pool2.request().query
          (`select * from Gestion`)
        const ListadoG = result2.recordset

        global.SesionU = datosUsuario;
        let tituloP = " A inicio"
        datosUsuario[0].tituloP = tituloP;
        return res.render('procesos/gestionCohorte', { datosUsuario, ListadoA, ListadoG });

      }
      else {
        req.session.destroy();
        const error_ = [
          { error1: "Usuario y contraseña no son válidos" }]
        res.render("login", { error_, layout: 'partials/empty' });

      }
    })
  }
  else {
    req.session.destroy();
    res.render("login", { layout: 'partials/empty' });
  }

};



async function CargaConfiguracion(req, res) {

  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;
        let tituloP = " A configuración de los Usuarios"
        datosUsuario[0].tituloP = tituloP;

        const pool1 = await conex.getConnection();
        const result = await pool1.request().query
          ("select * from Roles")
        const query_rol = result.recordset;

        res.render("procesos/configuracionUsuarios", { query_rol, datosUsuario })
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


function configuracionUsuarios(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;

        function atenciones_paciente() {
          return new Promise((resolve, reject) => {
            var options = {
              'method': 'GET',
              'url': `http://10.91.20.27//ApiRecursosGesis/api/EmpleadosSistema?Identificacion=${Identificacion}`,
              'headers': {
                'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
              }
            };

            request(options, function (error, response) {
              if (error) {
                reject(error);
              }
              let USuario = data = JSON.parse(response.body);
              resolve(USuario);
            });
          });
        }

        res.render("procesos/configuracionUsuarios", { datosUsuario })
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

function buscar(req, res) {
  const Identificacion = req.body.id;
  function atenciones_paciente() {
    return new Promise((resolve, reject) => {
      var options = {
        'method': 'GET',
        'url': `http://10.91.20.27//ApiRecursosGesis/api/EmpleadosSistema?Identificacion=${Identificacion}`,
        'headers': {
          'Authorization': 'Basic ' + Buffer.from('prosalco:desarrollo2023*').toString('base64')
        }
      };

      request(options, function (error, response) {
        if (error) {
          reject(error);
        }
        let USuario = data = JSON.parse(response.body);
        resolve(USuario);
      });
    });
  }

  async function listarConfiguracionUsuario() {
    return new Promise(async (resolve, reject) => {
      try {
        const pool1 = await conex.getConnection();
        const result = await pool1.request().query
          ("select * from Roles")
        const query_rol = result.recordset;
        resolve(query_rol)
      }
      catch (err) {
        reject(err)
      }
    })
  }

  Promise.all([atenciones_paciente(), listarConfiguracionUsuario()])
    .then(values => {
      try {
        if (req.session.user) {
          if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
            req.session.user.lastVisit = Date.now();
            var datosUsuario = global.SesionU;
            let [resultado_api_1, query_rol] = values;

            //cargarlistado



            res.render('procesos/configuracionUsuarios', { resultado_api_1, query_rol, datosUsuario })
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

    })
    .catch(error => {
      try {
        if (req.session.user) {
          if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
            req.session.user.lastVisit = Date.now();
            var datosUsuario = global.SesionU;
            res.render('/configuracionUsuarios', { datosUsuario })
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

    });

}


async function CrearActualizarRol(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;
        const Identificacion = req.body.identificacion
        const rol = req.body.listarol
        const Nombrec = req.body.nombre
        try {
          //evaluar si existe
          const pool2 = await conex.getConnection();
          let consulta = `select * from Roles where identificacion='${Identificacion}'`;
          const result2 = await pool2.request().query(consulta)
          const existe = result2.recordset;
          if (existe.length > 0) {
            //actualizar
            const pool = await conex.getConnection();
            await pool
              .request()
              .input('identificacion', sql.VarChar, Identificacion)
              .input('rol', sql.VarChar, rol)
              .query(
                'UPDATE Roles SET rol = @rol where identificacion = @identificacion'
              );
          }
          else {
            //insertar
            const pool = await conex.getConnection();
            await pool
              .request()
              .input('identificacion', sql.VarChar, Identificacion)
              .input('nombre', sql.VarChar, Nombrec)
              .input('rol', sql.VarChar, rol)
              .query(
                'INSERT INTO Roles(identificacion,Nombre,rol) VALUES (@identificacion,@Nombre,@rol)'
              );
          }

          //cargarlistado
          const pool1 = await conex.getConnection();
          const result = await pool1.request().query

            ("select * from Roles")
          const query_rol = result.recordset;

          return res.render('procesos/configuracionUsuarios', { query_rol, datosUsuario });

        }
        catch (Error) {
          return res.render('procesos/configuracionUsuarios', { datosUsuario });

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
  };
}


async function cargarArchivo(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;

        try {
          let archivo = req.file;
          let nombre = archivo.originalname.split('.');
          let Extension = nombre[nombre.length - 1]
          if (Extension.toUpperCase() == "XLSX" || Extension.toUpperCase() == "XLS") {
            const workbook = xlsx.readFile(req.file.path)
            // Convertir la hoja de cálculo a un objeto JSON
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const datax = xlsx.utils.sheet_to_json(sheet);
            if (datax.length == 0) {
              let error_ = ["x"];
              return res.send(error_)
            }

            for (let i = 0; i < datax.length; i++) {
              const fechaEnNumeroSerie = datax[i]['Fecha']; // asumiendo que la fecha se encuentra en una columna llamada 'fecha'
              const fechaEnJS = new Date((fechaEnNumeroSerie - (25567 + 1)) * 86400 * 1000);
              datax[i]['Fecha'] = fechaEnJS.toLocaleDateString('es-ES'); // formatear la fecha como 'DD/MM/YYYY'
            };

            //validar estructura del archivo
            let result = "";
            for (let i = 0; i <= datax.length; i++) {
              let b = 'Identificacion' in datax[0] ? true : false;
              let a = 'Eps' in datax[0] ? true : false;
              let c = 'Estado' in datax[0] ? true : false;
              let d = 'Fecha' in datax[0] ? true : false;
              result = a && b && c && d ? true : false;
              break;
            }
            let t = ""
            // guardar en base de datos
            if (result) {
              datax.forEach(async (row) => {
                t = "."
                const pool1 = await conex.getConnection();
                const result = await pool1.request().query
                  (`select * from Afiliados where Identificacion=${row.Identificacion}`)
                const UsuarioEnListado = result.recordset
                let tam = UsuarioEnListado.length;
                let basedb = UsuarioEnListado[0]
                if (tam > 0) {
                  if (basedb.eps != row.eps) {
                    const pool = await conex.getConnection();
                    await pool
                      .request()
                      .input('Identificacion', sql.VarChar, row.Identificacion)
                      .input('Eps', sql.VarChar, row.Eps)
                      .input('Estado', sql.VarChar, row.Estado)
                      .input('Fecha', sql.VarChar, row.Fecha)
                      .query(
                        'UPDATE Afiliados SET Eps = @Eps ,Estado = @Estado,Fecha = @Fecha where Identificacion = @Identificacion '
                      );
                  }

                }
                else {

                  const pool = await conex.getConnection();
                  await pool
                    .request()
                    .input('Identificacion', sql.VarChar, row.Identificacion)
                    .input('Eps', sql.VarChar, row.Eps)

                    .input('Estado', sql.VarChar, row.Estado)
                    .input('Fecha', sql.VarChar, row.Fecha)
                    .query(
                      'INSERT INTO Afiliados(Identificacion,Eps,Estado,Fecha) VALUES (@Identificacion,@eps,@estado,@fecha)'
                    );

                }
              });

              if (t.length == 0) {
                let error_ = ["x"];
                return res.send(error_)
              }

              //traer listado
              const pool1 = await conex.getConnection();
              const resulx = await pool1.request().query
                ("select * from Afiliados")
              const Listado = resulx.recordset

              global.SesionU = datosUsuario;
              return res.send(Listado);

            }
            else {
              let error_ = ["x"];
              return res.send(error_)
            }
          }
          else {
            const error_ = [
              { error1: "archivo no valido" }];
          }
        }
        catch {
          const error_ = [
            { error1: "archivo no valido" }]

          res.render('procesos/gestionCohorte', { error_ })
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

async function Buscarusuario(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        // var datosUsuario = global.SesionU;

        try {

          let idUsuario = req.query.txtIdentificacionG;
          //traer listado
          const pool1 = await conex.getConnection();
          const resultx = await pool1.request().query(`select * from Gestion where identificacionUsu +' '+ nombre + ' '+ eps like '%${idUsuario}%'`)
          //let Listado = resultx.recordset;
          return res.send(resultx.recordset);

        }
        catch {
          const error_ = [
            { error1: "Error al buscar usuario." }]

          res.send({ error_ })
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
/*
async function CargarPrincipal(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;

        try {

          //traer listado afiliado
          const pool1 = await conex.getConnection();
          const result = await pool1.request().query
            (`select * from Afiliados `)
          const ListadoA = result.recordset

          //traer listado gestion
          const pool2 = await conex.getConnection();
          const result2 = await pool2.request().query
            (`select * from Gestion`)
          const ListadoG = result.recordset

          res.render('procesos/gestionCohorte', { datosUsuario, ListadoA, ListadoG });
        }
        catch {
          const error_ = [
            { error1: "Error al iniciar" }]

          res.render('procesos/gestionCohorte', { error_ })
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
*/
async function precargar(req, res) {
  let identificacion = req.body.id
  global.Usuario = identificacion
}

//para gestion 

async function ArchivoG(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        var datosUsuario = global.SesionU;


        try {
          let archivo = req.file;
          let nombre = archivo.originalname.split('.');
          let Extension = nombre[nombre.length - 1]
          if (Extension.toUpperCase() == "XLSX" || Extension.toUpperCase() == "XLS") {
            const workbook = xlsx.readFile(req.file.path)
            // Convertir la hoja de cálculo a un objeto JSON
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const datax = xlsx.utils.sheet_to_json(sheet);

            //validar si esta vacio 
            if (datax.length == 0) {
              let error_ = ["x"];
              return res.send(error_)
            }
            //validar estructura del archivo
            let result = "";
            for (let i = 0; i <= datax.length; i++) {
              let a = 'eps' in datax[0] ? true : false;
              let b = 'identificacionUsu' in datax[0] ? true : false;
              let c = 'nombre' in datax[0] ? true : false;
              result = a && b && c ? true : false;
              break;
            }
            let v = ""

            // guardar en base de datos
            if (result) {
              datax.forEach(async (row) => {
                v = "."


                const pool1 = await conex.getConnection();

                const result = await pool1.request().query
                  (`select * from Gestion where identificacionUsu=${row.identificacionUsu}`)
                const Usuariomostrar = result.recordset
                let tam = Usuariomostrar.length;
                let basedb = Usuariomostrar[0]
                if (tam > 0) {
                  if (basedb.eps != row.eps) {
                    const pool = await conex.getConnection();
                    await pool
                      .request()
                      .input('identificacionUsu', sql.BigInt, row.identificacionUsu)
                      .input('eps', sql.VarChar, row.eps)
                      .query(
                        'UPDATE Gestion SET eps = @eps where identificacionUsu = @identificacionUsu'
                      );
                  }
                }
                else {

                  const pool = await conex.getConnection();
                  await pool
                    .request()
                    .input('identificacionUsu', sql.BigInt, row.identificacionUsu)
                    .input('nombre', sql.VarChar, row.nombre)
                    .input('eps', sql.VarChar, row.eps)
                    .query(
                      'INSERT INTO Gestion(identificacionUsu,nombre,eps) VALUES (@identificacionUsu,@nombre,@eps)'
                    );
                }
              });

              if (v.length == 0) {
                let error_ = ["x"];
                return res.send(error_)
              }

              //traer listado
              const pool1 = await conex.getConnection();
              const result = await pool1.request().query
                ("select * from Gestion")
              const mostrar = result.recordset
              res.send(mostrar);
            }
            else {
              let error_ = ["x"];
              return res.send(error_)
            }
          }
          else {
            const error_ = [
              { error1: "archivo no valido" }];
          }
        }
        catch {
          const error_ = [
            { error1: "archivo no valido" }]

          res.render('procesos/gestionCohorte', { error_ })
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

//afliados 
async function Buscarusua(req, res) {
  try {
    if (req.session.user) {
      if (req.session.user.lastVisit + (600 * 1000) > Date.now()) {
        req.session.user.lastVisit = Date.now();
        // var datosUsuario = global.SesionU;

        try {
          let idUsuario = req.query.idAfiliados;
          //traer listado
          const pool1 = await conex.getConnection();
          const resultx = await pool1.request().query(`select * from Afiliados where Identificacion +' '+ Eps +' '+ Estado +' '+ Fecha like '%${idUsuario}%'`)
          return res.send(resultx.recordset);

        }
        catch {
          const error_ = [
            { error1: "Error al buscar usuario." }]

          res.send({ error_ })
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

//Precarga
async function datosG(req, res) {

  try {
    // let idUs = req.body.identificacionUsu;
    //traer lista 
    const pool2 = await conex.getConnection();
    const result2 = await pool2.request().query(`select * from Gestion`)
    const ListadoG = result2.recordset
    res.send(ListadoG)

  } catch (error) {
    console.log(error)
  }
}
async function datosF(req, res) {

  try {
    // let idUs = req.body.identificacionUsu;
    //traer lista 
    const pool2 = await conex.getConnection();
    const result2 = await pool2.request().query(`select * from Afiliados`)
    const ListadoA = result2.recordset
    res.send(ListadoA)

  } catch (error) {
    console.log(error)
  }
}



module.exports = {
  gestionCohorte: gestionCohorte,
  filtros: filtros,
  login: login,
  ingresar: ingresar,
  salir: salir,
  configuracionUsuarios: configuracionUsuarios,
  buscar: buscar,
  CrearActualizarRol: CrearActualizarRol,
  CargaConfiguracion: CargaConfiguracion,
  cargarArchivo: cargarArchivo,
  Buscarusuario: Buscarusuario,
  //CargarPrincipal: CargarPrincipal,
  precargar: precargar,
  ArchivoG: ArchivoG,
  Buscarusua: Buscarusua,
  datosG: datosG,
  datosF: datosF
}