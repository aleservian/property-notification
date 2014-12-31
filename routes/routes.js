var exports = module.exports = {},
    homesController=require('../controllers/homes.js');
exports.main=function(app,router){
	router.get("/",function(req,res){
	   	res.render('index');
	})
	router.route('/api/v1/homes')
	   .get(homesController.list)
	   .post(homesController.create)

	router.route("/api/v1/homes/:id")
	   .get(homesController.retrieve) 

	router.route('/api/v1/notification')
	   .get(homesController.listNotification)   

    router.route('/api/v1/notification/count')
	   .get(homesController.countNotification)   

	app.use('/',router);
}