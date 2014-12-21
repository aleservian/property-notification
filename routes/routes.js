var exports = module.exports = {};
exports.main=function(app,router){
	router.get("/",function(req,res){
	   	res.render('index');
	})
	app.use('/',router);
}