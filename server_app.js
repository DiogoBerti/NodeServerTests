var http = require('http');
// Usado para capturar variaveis na url
var url = require('url');
// File Server
var fs = require('fs');
// Formidable...
var formidable = require('formidable');
// Rest api...
var unirest = require('unirest');
// Path para add o CSS
 var path = require('path')

// Primeiros testes com o Server em node...

http.createServer(function (req, res) {
  // Quando um file for subido para o server...
  if (req.url == '/fileupload') {
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {
      res.write('File uploaded');
      console.log(req);
      console.log(fields);
      console.log(files);

      res.end();
    });
  }else if(req.url == '/form_to_validate')  {
    // Biblioteca para fazer o parse do Formulario...
    var form = new formidable.IncomingForm();
    form.parse(req, function (err, fields, files) {

      console.log(fields)
      unirest.post('http://localhost:8069/info')
      .header('Accept', 'application/json')
      .send({ 'name':fields.name,
              'email':fields.email,
              'company_type':fields.company_type,
              'zip':fields.zip,
              'cnpj_cpf':fields.cnpj,
              'street':fields.stree,
              'is_company':true,
              'street2':fields.nro + " " + fields.street2,


            })
      .end(function (response) {
        console.log(response.body);
      });
      // Checa se o field name (inputado no form) é Ligia, se form mostra uma coisa...
      // Caso não... mostra outra...
      if(fields.name == 'Ligia'){
          res.write('<p> Welcome Ligia!</p>');
          // var sys = require('util')
          // var exec = require('child_process').exec;
          // function puts(error, stdout, stderr) { console.log(stdout) }
          // Executando um codigo da linha...
          //exec("node another_server.js", puts);
          // exec("./a.out", puts);

      }

      fs.readFile('greet.html', function(err, site) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(site, function(err) {
        res.end();
       });
    });

      console.log(fields);
      // res.end();
    });
  }else{

    var Odoo = require('odoo-xmlrpc');
    var odoo = new Odoo({
    url: 'http://localhost',
    port: '8069',
    db: 'registries_test',
    username: 'admin',
    password: 'admin'
    });

    odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true]]);
    inParams.push(0);  //offset
    inParams.push(10);  //Limit
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search', params, function (err, value) {
        if (err) { return console.log(err); }
        var inParams = [];
        inParams.push(value); //ids
        inParams.push(['name', 'country_id', 'comment']); //fields
        var params = [];
        params.push(inParams);
        odoo.execute_kw('res.partner', 'read', params, function (err2, value2) {
            if (err2) { return console.log(err2); }
            console.log('Result: ', value2);
        });
    });
});

    fs.readFile('index.html', function(err, data) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    res.end();
  })};


  //Cria um arquivo...
//   fs.appendFile('mynewfile1.txt', 'Hello content!', function (err) {
//   if (err) throw err;
// });
  /*  Primeiros testes com o Server...
  //HTTP header
    res.writeHead(200, {'Content-Type': 'text/html'});
    var q = url.parse(req.url, true).query;
    var txt = q.year + " " + q.month;
    res.end(txt)
    //res.write('The date and current time are: ' + dt.myDateTime())
    // res.end('<p>Hello World!</p>');
  */
}).listen(8080);
