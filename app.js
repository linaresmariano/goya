
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var grilla = require('./routes/grilla/index');
var cursos = require('./routes/cursos/index');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/grilla', grilla.index);
app.get('/cursos', cursos.index);
app.get('/cursos/:id', cursos.curso);
app.get('/cursos/:id/:comision', cursos.comision);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});



// hacemos referencia a la dependencia
var mongodb = require('mongodb');
 
// obtenemos el server MongoDB que dejamos corriendo
// *** el puerto 27017 es el default de MongoDB
var server = new mongodb.Server("127.0.0.1", 27017, {});
 
// obtenemos la base de datos de prueba que creamos
var dbTest = new mongodb.Db('unTestDB', server, {})
 
// abrimos la base pasando el callback para cuando esté lista para usar
/* dbTest.open(function (error, client) {
  if (error) throw error;
 
  //en el parámetro client recibimos el cliente para comenzar a hacer llamadas
  //este parámetro sería lo mismo que hicimos por consola al llamar a mongo
   
  //Obtenemos la coleccion personas que creamos antes
  var collection = new mongodb.Collection(client, 'personas');
   
  //disparamos un query buscando la persona que habiamos insertado por consola
  collection.find({'nombre': 'pepe'}).toArray(function(err, docs) {
 
    //imprimimos en la consola el resultado
    console.log(docs);
  });
}); */