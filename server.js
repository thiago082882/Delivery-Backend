const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const multer = require('multer');
const serviceAccount = require('./serviceAccountKey.json');
const admin = require('firebase-admin');
const io = require('socket.io')(server);
const ordersDeliverySocket = require('./sockets/orders_delivery_socket');
const mercadoPago = require('mercadopago');





mercadoPago.configure({
     access_token: 'TEST-5210485235887136-050216-f23083f3018994e0e2c8cc518a650343-348750320'
 });
 

/*
*Storage image
*/

admin.initializeApp({
     credential: admin.credential.cert(serviceAccount)
 });
 
 
 const upload = multer({
     storage: multer.memoryStorage()
 });
 


/* */

/*
*ROTAS USERS
*/

const users = require('./routes/usersRoutes');
const categorias = require('./routes/categoriasRoutes');
const products = require('./routes/productsRoutes');
const address = require('./routes/addressRoutes');
const orders= require('./routes/ordersRoutes');
const mercadoPagoRoutes = require('./routes/mercadoPagoRoutes');


/* FIM DA ROUTA USERS */

const port = process.env.PORT || 3000;

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
     extended:true

}));

app.use(cors());
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.disable('x-powered-by');

app.set('port',port);


/*
* CHAMANDO ROTAS USERS
*/
users(app,upload);
categorias(app,upload);
products(app,upload);
address(app);
mercadoPagoRoutes(app);
orders(app);


/*

* CHAMAR OS SOCKETS

*/

ordersDeliverySocket(io);

server.listen(3000,'10.0.0.101' || 'localhost',function(){

     console.log('Aplicação de NodeJS ' + port + 'Iniciada...')


});

//ERROR HANDLER

app.use((err,req,res,next) =>{
console.log(err);
res.status(err.status || 500).send(err.stack);
});

module.exports = {
     app:app,
     server : server
}

// 200 - RESPOSTA BEM SUCEDIDA
// 404 - NÃO EXISTE 
// 500 - ERROR INTERNO DO SERVIDOR