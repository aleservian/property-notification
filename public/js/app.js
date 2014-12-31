var socket = io('http://localhost:8000');
function formBinds(data) {
  return function(e) {data[e.target.name] = e.target.value;};
}
var listHomes = {
    newhome:function(data){
        var data = data || {};
        this.name = data.name || '';
        this.latitude = data.latitude || '';
        this.longitude = data.longitude || '';
    },
    home:function(data){
        var data = data || {};
        this._id = m.prop(data._id || "");
        this.name = m.prop(data.name || "");
        this.latitude = m.prop(data.latitude || "");
        this.longitude = m.prop(data.longitude || "");
        this.slug = m.prop(data.slug || "");
    },
    list:function(){
        var self = this;
        self.posts = m.prop([]);
        return m.request({method: "GET", url: "http://localhost:8000/api/v1/homes", type: listHomes.home})
               .then(self.posts);
    },
    sockets:function(){
        var self = this;
        var contador = m.prop('asfd');
        self.contador=contador;
        m.startComputation();
        socket.on('visits', function(visitas){
            self.contador(visitas);
            m.endComputation();
        });
    },
    controller:function(){
        listHomes.list();
        listHomes.sockets();
        var newhome = new listHomes.newhome();
        this.newhome = newhome;
        this.create=function(e){
            e.preventDefault();
            m.request({
              method: 'POST',
              url: 'http://localhost:8000/api/v1/homes',
              data: newhome
            }).then(function(data){
                console.log(data.data);
                var homes = new listHomes.home(data.data);
                listHomes.posts().push(homes);
            });
        }.bind(this);
    },
    view:function(ctrl){
        return [
            m('contador',listHomes.contador()),
            m("form",{onsubmit: ctrl.create,onchange:formBinds(ctrl.newhome)},[
                m("input",{type: 'text',name: 'name',placeholder: 'Nome:'}),
                m("input",{type: 'text',name: 'latitude',placeholder: 'Latitude:'}),
                m("input",{type: 'text',name: 'longitude',placeholder: 'Logintude:'}),
                m("button",{type: 'submit'},"Enviar")
            ]),
            m('ul',[
                listHomes.posts().map(function(home){
                    return m('li',[
                             m("a",{href: "/listhomes/"+home._id(),config: m.route,title: home.name()}, home.name())
                        ]) 
                })
            ])
        ]
    }
}
/**********INTERNA***********/
var listHomesIn = {
    home:function(data){
        var data = data || {};
        this._id = m.prop(data._id || "");
        this.name = m.prop(data.name || "");
        this.latitude = m.prop(data.latitude || "");
        this.longitude = m.prop(data.longitude || "");
        this.slug = m.prop(data.slug || "");
    },
    homein:function(id){
        var self = this;
        self.homeIn = new listHomes.home();
        return m.request({method: "GET", url: "http://localhost:8000/api/v1/homes/"+id, type: listHomes.home})
               .then(function(data){
                   self.homeIn=data;
               });
    },
    controller:function(){
        var id=m.route.param("id");
        listHomesIn.homein(id);
    },
    view:function(ctrl){
        return [
            m('h1',listHomesIn.homeIn.name()),
            m('p',listHomesIn.homeIn.latitude()),
            m('p',listHomesIn.homeIn.longitude()),
            m('a',{href: "/listhomes",config: m.route},"Lista de Imoveis")
        ]
    }
}
/******************/
m.route.mode = 'hash';
m.route(document.getElementById("app"), "/listhomes", {
    "/listhomes": listHomes,
    "/listhomes/:id": listHomesIn
});