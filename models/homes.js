var exports = module.exports = {},
    slug = require('slug'),
    mongoose=require('mongoose'),
    Schema = mongoose.Schema,
    imovel = new Schema({
	  name: {type: String},
	  slug: {type: String},
	  date_creation: {type: Date, default: Date.now},
	  longitude: {type: Number},
	  latitude: {type: Number}
    }),
    notification = new Schema({
    	title: {type: String},
    	type: {type: String},
    	id_item: {type: String},
    	view: {type: Boolean},
    	date_creation: {type: Date, default: Date.now}
    }),
    db=mongoose.model('homes',imovel),
    dbnoti=mongoose.model('notifications',notification);
exports.create=function(req,res){
    var dates=req.body,
        imovel,
        notification,
        datesNotification = {};
    dates.slug=slug(req.body.name).toLowerCase();
	imovel=new db(dates);
	imovel.save(function(err,data){
		if(err){
			console.log(err);
		}else{
			var success = {status: 'success',msg: 'Imovel Cadastrado com Sucesso!!',data: data}
			res.status(200).json(success);
			datesNotification.title = "Novo imovel criado: "+data.name;
		    datesNotification.type = "create"; 
		    datesNotification.id_item = data._id;
		    datesNotification.view = false;
			notification=new dbnoti(datesNotification);
			notification.save(function(err,data){
				if(err){
					console.log(err);
				}else{
					console.log(data);
				}
			});
		}
	}); 
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
exports.listNotification=function(req,res){
	var query={},
	    fields={},
	    sort={sort:{$natural: -1}}
	dbnoti.find(query,fields,sort,function(err,db){
		if(err){
			console.log(err);
		}else{
			res.status(200).json(db);
		}
	});
}
exports.countNotification=function(req,res){
	dbnoti.count({view: false},function (err, count) {
	    if(err){
			console.log(err);
		}else{
			res.status(200).json({count: count});
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
			  var query = {'id_item': db._id};
			  dbnoti.findOne(query,function(err,db){
			  	if(err){
					console.log(err);
				}else{
					if (db.view==false){
						var dates={view:true},
						    query={'_id': db._id};
						dbnoti.update(query,dates,function(err,db){
							if(err){
								console.log(err);
							}else{
								console.log(db);
							}
						});
					};
				}
			  })
			}else{
			  res.status(200).json({status: 'error',msn: "Não foi encontrado nenhum dado"});
			}
		}
	});
}