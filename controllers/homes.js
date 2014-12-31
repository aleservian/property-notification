var exports = module.exports = {},
    homesModel=require('../models/homes.js');
exports.create=function(req,res){
	homesModel.create(req,res);
}
exports.list=function(req,res){
	homesModel.list(req,res);
}
exports.listNotification=function(req,res){
	homesModel.listNotification(req,res);
}
exports.countNotification=function(req,res){
	homesModel.countNotification(req,res);
}
exports.retrieve=function(req,res){
	homesModel.retrieve(req,res);
}