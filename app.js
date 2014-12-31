var express = require('express'),
    router=express.Router(),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io')(server),
    bodyParser = require('body-parser'),
    mongoose=require('mongoose'),
    routes=require('./routes/routes.js'),
    db=mongoose.connection;
/******CONNECT DB*****/
mongoose.connect('mongodb://localhost/notification');
db.on('error', function(err){
    console.log('Erro de conexao.', err)
});
db.once('open', function () {
  console.log('Conexão aberta.')
});
/******CONFIG*********/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
/******ROUTES*********/
routes.main(app,router);
/******REALTIME********/
var visitas = 0;
/*io.enable('browser client minification');*/
io.sockets.on('connection',function(socket){
    visitas++;
    socket.emit('visits', visitas);
    socket.broadcast.emit('visits', visitas);
    socket.on('disconnect', function(){
        visitas--;
        // Atualiza o total de visitas para os demais usuários.
        socket.broadcast.emit('visits', visitas);
    });
})
/*****INIT SERVER******/
server.listen(8000,function(){
	console.log("Notification 8000");
});