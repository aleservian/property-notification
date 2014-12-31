var exports = module.exports = {},
    slug = require('slug'),
    mongoose=require('mongoose'),
    Schema = mongoose.Schema,
    imovel = new Schema({
	  name: {type: String},
	  slug: {type: String},
	  date_creation: {type: Date, default: Date.now},
	  longitude: {type: String},
	  latitude: {type: String}
    }),
    notification = new Schema({
    	title: {type: String},
    	type: {type: String},
    	date_creation: {type: Date, default: Date.now}
    }),
    db=mongoose.model('homes',imovel),
    dbnoti=mongoose.model('notifications',notification);
exports.create=function(req,res){
    var dates=req.body,
        imovel;
    dates.slug=slug(req.body.name).toLowerCase();
	imovel=new db(dates);
	imovel.save(function(err,data){
		if(err){
			console.log(err);
		}else{
			var success = {status: 'success',msg: 'Imovel Cadastrado com Sucesso!!',data: data}
			res.status(200).json(success);
		}
	}); 

	

	/*notification=new dbnoti({title:'teste'});
	notification.save(function(err,data){
		if(err){
			console.log(err);
		}else{
			var success = {status: 'success',msg: 'Imovel Cadastrado com Sucesso!!',data: data}
			res.status(200).json(success);
		}
	}); */
}
exports.list=function(req,res){
	var query={};
	db.find(query,function(err,db){
		if(err){
			console.log(err);
		}else{
			res.status(200).json(db);
		}
	});
}
exports.retrieve=function(req,res){
	var id = req.params.id,
	    query={'_id': id};
	db.findOne(query,function(err,db){
		if(err){
			res.status(200).json({status: 'error',msn: "Não foi encontrado nenhum dado"});
		}else{
			if(db!='' && db!=null){
			  res.status(200).json(db);
			}else{
			  res.status(200).json({status: 'error',msn: "Não foi encontrado nenhum dado"});
			}
		}
	});
}