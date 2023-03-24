const express = require('express');
const rutas_ = require('../Controllers/controladorutas');
const ayuda = require("../Controllers/opciones")
const control = require('../Controllers/controllerPaginas');
//Impoirt's xiomara
const controlpaginas = require('../Controllers/cohorte');
const controlx = require('../Controllers/camposCohorte');
const controledit = require('../Controllers/editar');
const controleli = require('../Controllers/eliminar');
const cerrar_ = require('../Controllers/control');
const gestion = require('../Controllers/gestion');
const multer = require('multer');
const upload = multer({ dest: 'cargarArchivo/' });

const router = express.Router();

//router.get('/gestionCohorte', rutas_.gestionCohorte);
//router.get('/filtros', rutas_.filtros);

router.get('/', rutas_.login);
router.post('/', rutas_.ingresar);

//rutas Juan

router.get('/filtros', ayuda.inicio)
router.post('/filtro', ayuda.filtro)
router.get('/filtro1', ayuda.sedes);

//rutas Sebastian
router.get('/gestionCohorte', control.pagina_principal);
router.post('/gestionCohorte', control.datos_atenciones_apis);
router.post('/gestionCohorte/gestion', control.GuardarGestion);
router.get('/gestionCohorte/gestion', control.pagina_principal);
router.get('/gestionCohorte/info', control.listar_select);

//rutas Xiomara

router.get('/confiCohorte', controlpaginas.cohorte1);
router.get('/confiCohorte', controlx.consultains);
router.post('/confiCohorte', controlpaginas.cohorte2);

router.post('/cohortecampo', controlx.insert2);
router.get('/cohortecampo', controlx.consultarCohorte);

router.get('/confiCohorte/:codigo', controleli.eliminarCohorte);
router.get('/cohortecampo/:codigo', controleli.eliminarCampos);


router.get('/editarCohorte/:codigo', controledit.datosCohorte);
router.get('/editarCampos/:codigo', controledit.datosCampos);

router.post('/editarCohorte', controledit.actualizarCohorte)
router.get('/editarCohorte', controlpaginas.cohorte1)
router.get('/editarCohorte', controlx.consultains)

router.post('/editarCampos', controledit.editarcampo)
router.get('/editarCampos', controlpaginas.cohorte2)
router.get('/editarCampos', controlx.consultains)


//ruta para configuracion de usuarios
router.get('/configuracionUsuarios', rutas_.CargaConfiguracion);
router.get('/configuracionUsuario', rutas_.CargaConfiguracion);
router.post('/configuracionUsuarios', rutas_.buscar);
router.post('/configuracionUsuario', rutas_.CrearActualizarRol);

//__________________________________________________________________________________________________________________________
router.post('/cerrarGestion', cerrar_.cerrarGestion);


//archivos afiliados
router.get('/procesos/gestionCohortex', rutas_.Buscarusuario)
//router.get('/procesos/gestionCohorte', rutas_.CargarPrincipal)
//router.post('/cargarArchivo', upload.single('file'), rutas_.cargarArchivo);
router.post('/cambio', rutas_.precargar);


//excel gestion
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'ArchivoG/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload2 = multer({ storage: storage })
router.post('/ArchivoG', upload2.single('file'), rutas_.ArchivoG);
router.get('/afiliados', rutas_.Buscarusua)


//excel Afiliados
const storage2 = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'cargarArchivo/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload3 = multer({ storage: storage2 })
router.post('/cargarArchivo', upload3.single('file'), rutas_.cargarArchivo);

//precarga
router.get('/gestiondatos', rutas_.datosG)
router.get('/procesos/gestionCohorte', rutas_.datosF)

//ruta boton descargar gestion
router.get('/gestion', gestion.archivoGest)
router.get('/botonGestion', gestion.cargar)

router.get('/descargarGestiones', gestion.descargar)
router.get('/ValidarArchivo', gestion.validar)


module.exports = router;



