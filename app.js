var express = require('express'),
    router=express.Router(),
    app = express(),
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
/******ROUTES*********/
routes.main(app,router);
/******CONFIG*********/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));
app.listen(8000,function(){
	console.log("Notification 8000");
});