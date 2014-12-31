var exports = module.exports = {};
var visitas = 0;
exports.main=function(io){
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
}