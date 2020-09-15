const axios = require('axios');
var http = require('http');
const fs = require('fs');
const url = require('url'); 
const { info } = require('console');

let htmlInicio = '<!DOCTYPE html> <html lang="en"> <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"><title>NodeJS</title><link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossorigin="anonymous"></head><body><table class="table table-striped"><h1 class="text-center">Listado de ';
let htmlMedio = '</h1><thead><tr><th scope="col">ID</th><th scope="col">Nombre</th><th scope="col">Contacto</th></tr></thead><tbody id="table">';
let htmlFin = '</tbody></table></body></html>';

let urlProveedores = "https://gist.githubusercontent.com/josejbocanegra/d3b26f97573a823a9d0df4ec68fef45f/raw/66440575649e007a9770bcd480badcbbc6a41ba7/proveedores.json";
let urlClientes = "https://gist.githubusercontent.com/josejbocanegra/986182ce2dd3e6246adcf960f9cda061/raw/f013c156f37c34117c0d4ba9779b15d427fb8dcd/clientes.json";

let promiseProveedores = axios.get(urlProveedores);
let promiseClientes = axios.get(urlClientes);

Promise.all([promiseClientes, promiseProveedores]).then(resp=> {

    http.createServer(function (req, res) {
        var q = url.parse(req.url, true);
        let filename ="";
        if (q.pathname.search('proveedores')==1) filename = 'proveedores';
        else if (q.pathname.search('clientes')==1) filename = 'clientes';

        fs.readFile(filename + ".html", function(err, data) {
            if (err) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                return res.end("404 Not Found");
            }

            let promise = filename==="proveedores"? resp[1] : resp[0];
            let info = promise.data;

            let html = "";
            for (let i=0; i < info.length; i++) {
                console.log(info[i]);
                let id = filename==="proveedores"? info[i].idproveedor : info[i].idCliente;
                let nombrecompania = filename==="proveedores"? info[i].nombrecompania : info[i].NombreCompania;
                let nombrecontacto = filename==="proveedores"? info[i].nombrecontacto : info[i].NombreContacto;
                html += "<tr><td>" + id + "</td><td>"+ nombrecompania +"</td><td>"+ nombrecontacto +"</td></tr>";
            }

            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write(htmlInicio + filename + htmlMedio + html + htmlFin);
            return res.end();
        })

    }).listen(8081); 
    
});