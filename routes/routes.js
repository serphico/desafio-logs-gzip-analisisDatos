const {Router} = require('express');
const passport = require('passport');
const prodGen = require('../controllers/prodGen.js')
const isAuth = require('../util/isAuth.js')
const path = require('path')
const {fork} = require('child_process');
const { render } = require('pug');
const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const compression = require('compression')
const logger = require('../util/logger.js')

/*:::: RUTAS :::::*/
const appRoute = Router();
const chatRoute = Router();
const loginRoute = Router();
const registerRoute = Router();
const logoutRoute = Router();
const infoRoute = Router();
const randomRoute = Router();
const failLoginRoute = Router();
const failRegisterRoute = Router();

chatRoute.get('/', isAuth,(req,res) => {
    
    res.render('./layouts/index.pug')
})

appRoute.get('/', /*isAuth,*/(req, res) => {
    try {
        let products = prodGen();
        let user = req.session.email
        res.render('./layouts/productos.pug',{products,user})  
    } catch (err) {
        logger.error(`${err}`);

    }


})

appRoute.post('/', (req, res) => {

        let user = req.session.email

        req.session.destroy( err =>{
            if(err){
                console.log(err)
                logger.error(`${err}`);
            }else{
                    res.render('./layouts/byeUser.pug',{user})
            }
        })





})


registerRoute.get('/', (req,res) => {

    res.render('./layouts/registro.pug')
})

registerRoute.post('/', passport.authenticate('registro',{failureRedirect: '/failregistro', successRedirect: '/login'}))

loginRoute.get('/', (req,res) => {

    res.render('./layouts/login.pug')
})

loginRoute.post('/', passport.authenticate('login',{failureRedirect: '/faillogin'}),(req, res)=>{
   
    req.session.email = req.body.username
    logger.info(`Se logueo con exito ${req.body.username} en la Ruta: /login`)
    res.redirect('/api/productos-test')
})

logoutRoute.get('/', (req, res) => {
    req.logOut();
    res.redirect('/login')
})

failLoginRoute.get('/',(req, res)=>{
    logger.error(`usuario no tiene cuenta`);
    res.render('./layouts/loginfail.pug')
})

failRegisterRoute.get('/',(req, res)=>{
    logger.error(`usuario tuvo error al registrar cuenta`);
    res.render('./layouts/registrofail.pug')
})

infoRoute.get('/', compression(),/*isAuth,*/(req,res) =>{
    let user = req.session.email
    console.log(numCPUs)
    let infoSys ={
        Argumentos: process.argv,
        Procesador: process.platform,
        VersionNode: process.version,
        Memoria: JSON.stringify(process.memoryUsage()),
        DireccionEjecucion: process.execPath,
        ProcessId: process.pid,
        DireccionProyecto: process.cwd(),
        NumeroProcesadores: numCPUs
    }
    console.log(infoSys)
    logger.info(`${JSON.stringify(infoSys)}`)
    res.render('./layouts/info.pug',{infoSys,user})
})

randomRoute.get('/',(req ,res) =>{
    res.render('./layouts/random.pug')
})
randomRoute.get('/envio', (req,res) =>{

        /*const forked = fork(path.resolve(__dirname, '../randomNum.js'))
        forked.on('message', msg => {
            if (msg == 'listo') {
                    if(!req.query.cant){
                        let cant = 10000000

                        forked.send(`${cant}`)
                    }else{
                        let cant = req.query.cant

                        forked.send(`${cant}`)

                    }
    
            } else {
                console.log(`resultado: ${msg}`)

                    res.render('./layouts/random.pug', {msg})
                
            }
         })*/
         

    
         function numeroRandom(cant) {
  
            let numerosFinales =[]
            for (let i = 0; i < cant; i++) {
        
                let numRandom = Math.floor((Math.random() * (1000 - 1)) + 1);
                numerosFinales.push(numRandom)
    
             }
    
             let numDuplicados = numerosFinales.sort()
             let arrayFinal = []
             let count = 0;
             for (let index = 0; index < numDuplicados.length; index++) {
                 if(numDuplicados[index+1] === numDuplicados[index]){
                     count++
                    arrayFinal.push(`el numero ${numDuplicados[index]} se repite ${count} veces`)
                 }
                 
             }
        
            return arrayFinal;
        
    
    }

    if(!req.query.cant){
        let cant = 10000000
        numeroRandom(cant)
     }else{
        numeroRandom(req.query.cant)
     }

})

module.exports = {appRoute,chatRoute,loginRoute,registerRoute,logoutRoute, failLoginRoute, failRegisterRoute,infoRoute, randomRoute};