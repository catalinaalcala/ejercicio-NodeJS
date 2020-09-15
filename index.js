const axios = require('axios');
var http = require('http');
const fs = require('fs');
const url = require('url'); 

let urlProveedores = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
let urlClientes = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

http.createServer(function (req, res) {
    var q = url.parse(req.url, true);
    let filename ="";
    if (q.pathname.search('proveedores')==1) filename = 'proveedores';
    else if (q.pathname.search('clientes')==1) filename = 'clientes';

    fs.readFile("index.html", function(err, data) {
        if (err) {
            res.writeHead(404, {'Content-Type': 'text/html'});
            return res.end("404 Not Found");
        }

        adapt(filename);

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    })

}).listen(8081); 

function adapt(filename) {
    let url = filename==="proveedores"? urlProveedores : urlClientes;
    axios.get(url);
    let document = "/index.html";
    document.getElementById("tipo").innerHTML("Listado de " + filename);
    Promise.then(res => res.json()).then(info => {

    });
}