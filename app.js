
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var grilla = require('./routes/grid/index');
var cursos = require('./routes/course/index');
var subject = require('./routes/subject/index');
var teacher = require('./routes/teacher/index');
var http = require('http');
var path = require('path');
var Sequelize = require('sequelize');
var db = require('./models');
var bodyParser = require('body-parser');


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
app.use(bodyParser());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

//grid
app.get('/grid', grilla.index);
app.get('/grid/:semester/:year', grilla.semester);

//semesters
app.get('/lastSemester', routes.lastSemester);

//courses
app.get('/courses', cursos.index);
app.get('/course/:id/:commission', cursos.commission);
app.get('/course/new', cursos.new);
app.post('/course/create', cursos.create);
app.post('/updateCourse', cursos.actualizar);
app.post('/updateEndCourse', cursos.actualizarFin);

//subjects
app.get('/subject/new', subject.new);
app.post('/subject/create', subject.create);

//teachers
app.get('/teacher/new', teacher.new);
app.post('/teacher/create', teacher.create);

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
  require('./extras/initialDataDB');

})

app.get('/rest', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});






