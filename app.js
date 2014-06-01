
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
//var grilla = require('./routes/grilla/index');
var cursos = require('./routes/cursos/index');
var http = require('http');
var path = require('path');
var Sequelize = require('sequelize');
var db = require('./models');


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
//app.get('/users', user.list);
//app.get('/grilla', grilla.index);
//app.get('/grilla/:cuatrimestre', grilla.cuatrimestre);
app.get('/cursos', cursos.index);
//app.get('/cursos/:id', cursos.curso);
//app.get('/cursos/:id/:comision', cursos.comision);
//app.post('/actualizarCurso', cursos.actualizar);
//app.post('/actualizarFinCurso', cursos.actualizarFin);

//http.createServer(app).listen(app.get('port'), function(){
//  console.log('Express server listening on port ' + app.get('port'));
//});


db
 .sequelize
  .sync({ force: true })
  .complete(function(err) {
    if (err) {
      throw err[0]
    } else {
      http.createServer(app).listen(app.get('port'), function(){
        console.log('Express server listening on port ' + app.get('port'))
      })
    }
}).success(function() {

  // Para cargar datos de pruebas
  require('./extras/defaultDatosDB');

})






