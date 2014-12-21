//namespace
var app = {};

//model
app.PageList = function() {
    return m.request({method: "GET", url: "http://localhost/goscore/api/v1/offline/cep/city/SP"});
};

//controller
app.controller = function() {
    var pages = app.PageList();
    return {
        pages: pages,
        rotate: function() {
            pages().push(pages().shift());
        }
    }
};

//view
app.view = function(ctrl) {
	console.log(ctrl);
    return [
        ctrl.pages().map(function(page) {
            return m("a", {href: page.id_cidade,title: page.cidade}, page.cidade);
        }),
        m("button", {onclick: ctrl.rotate}, "Rotate links")
    ];
};


//initialize
m.module(document.getElementById("app"), app);