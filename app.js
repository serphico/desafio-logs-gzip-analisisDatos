const express = require('express');
const { Server: HttpServer} = require('http');
const { Server: IOServer, Socket} = require('socket.io');
const dotenv = require('dotenv');
const {appRoute, chatRoute, loginRoute, registerRoute,logoutRoute,failLoginRoute, failRegisterRoute,infoRoute, randomRoute} = require('./routes/routes.js');
const chatCt = require('./controllers/chatController.js')
const cookieParse = require('cookie-parser')
const session = require('express-session')
const passport = require('passport');
const passportStrategy = require('./controllers/passportLogin.js')
const logger = require('./util/logger.js')

dotenv.config();

const app = express();

const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

app.use(express.json());

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use(cookieParse());

app.use(session({

    secret: 'secreto',
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 100000
    }    
}));

app.use(passport.initialize());

app.use(passport.session());

app.use(express.static('./views'));

app.set('view engine', 'pug');

app.set('views', "./views");

app.use(express.json())

app.use(express.urlencoded({extended:true}))

app.use('/login', loginRoute);

app.use('/registro', registerRoute);

app.use('/chat', chatRoute);

app.use('/api/productos-test', appRoute);

app.use('/logout', logoutRoute)

app.use('/failregistro', failRegisterRoute)

app.use('/faillogin', failLoginRoute)

app.use('/info', infoRoute)

app.use('/api/randoms', randomRoute)

app.use(function(req, res, next){ 
    res.status(404);
    if (req.accepts('json')){ 

        logger.warn(`url ${req.url} no existe`)
        res.send({ error: 'Not found' }); 
        
        return;
    
    }

})

io.on('connection', (socket) =>{

    console.log('usuario conectado');
    chatCt.readChat()
    .then(res => { 
         io.sockets.emit('messages', res);
         socket.emit('messages', res);

    })
    .catch(err => {
        logger.error(`Se registro un error en el chat en la Ruta: /chat, el error es ${err}`);
    })


    socket.on('new-messages', (messageData) =>{
        chatCt.readChat()
        .then(res => { 
            io.sockets.emit('messages', res);
    
        })
        .catch(err => {
            logger.error(`Se registro un error en el chat en la Ruta: /chat, el error es ${err}`);
        })
        chatCt.saveChat(messageData);
    })
   

})

module.exports = httpServer;
