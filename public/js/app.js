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
    controller:function(){
        listHomes.list();
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
var listIN=function(id){
    return m.request({method: "GET", url: "http://localhost:8000/api/v1/homes/"+id})
    .then(function(data){
        console.log(data);
    });
}
var listHomesIn = {
    controller:function(){
         var id=m.route.param("id");
         var homes = listIN(id);
         var ob = {name:'alexandre'}
        return {
            ob:ob,
            homes: homes
        }
    },
    view:function(ctrl){
        return [
            m('h1',ctrl.ob.name),
            m('a',{href: "/listhomes",config: m.route},"Lista de Imoveis")
        ]
    }
}
/******************/
var homesSave = {
    controller:function(){
        console.log('save');
    },
    view:function(ctrl){
        return [
            m("h1",'save'),
            m("form",[
                m("input",{type: 'text',name: 'txt_name',placeholder: 'Nome:'}),
                m("input",{type: 'text',name: 'txt_latitude',placeholder: 'Latitude:'}),
                m("input",{type: 'text',name: 'txt_logintude',placeholder: 'Logintude:'}),
                m("button",{type: 'submit'},"Enviar")
            ]),
            m('a',{href: "/listhomes",config: m.route},"Lista de Imoveis")
        ]
    }
}
m.route.mode = 'hash';
m.route(document.getElementById("app"), "/listhomes", {
    "/listhomes": listHomes,
    "/listhomes/:id": listHomesIn,
    "/save": homesSave
});