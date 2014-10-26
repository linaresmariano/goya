
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var classroom = require('./routes/classroom');
var schedule = require('./routes/schedule');
var grilla = require('./routes/grid');
var patch = require('./routes/patch');
var cursos = require('./routes/course');
var subject = require('./routes/subject');
var teacher = require('./routes/teacher');
var report = require('./routes/report');
var semester = require('./routes/semester');
var http = require('http');
var path = require('path');
var Sequelize = require('sequelize');
var db = require('./models');
var bodyParser = require('body-parser');



var app = express();

app.use(express.cookieParser());
app.use(express.session({secret: 'w345fawf4qw4sdrse5'}));

//app.use(function(req, res, next) {
 // res.locals.session = req.session;
 // next();
//});

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

global.showFeedbackPanel = function(res,msj,type){ 
	res.locals.feedbackpanel={msj:msj,type:type}; 
}; 

global.showErrors=function(req,err){
	errors=[];
	for(key in err){
		//req.flash('alert-'+typeMessage.ERROR, err.name[0]);
		for(h=0;h<err[key].length;h++){
			errors.push(err[key][h]);
		}
	}
	req.flash(typeMessage.ERROR, errors);
}

global.typeMessage = {ERROR:'alert alert-danger padding-alert',SUCCESS:'alert alert-success padding-alert',WARNING:'alert alert-warning padding-alert'}

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

//semester
app.get('/semester/new', semester.new);
app.post('/semester/create', semester.create);

//grid
app.get('/grid', grilla.index);
app.get('/grid/classrooms/:year/:semester', grilla.classrooms);
app.get('/grid/:year/:semester', grilla.semester);

//patch
app.put('/patch/update', patch.update);
app.put('/patch/teacherHide', patch.teacherHide);
app.put('/patch/teacherVisible', patch.teacherVisible);
app.put('/patch/updateVisibility', patch.updateVisibility);

//semesters
app.get('/lastSemester', routes.lastSemester);

//courses
app.get('/courses', cursos.index);
app.get('/course/new', cursos.new);
app.get('/course/edit/:id', cursos.edit);
app.post('/course/create', cursos.create);
app.post('/course/update/:id', cursos.update);
app.put('/updateCourse', cursos.updateCourseSchedule);
app.put('/updateEndCourse', cursos.updateEnd);
app.put('/assignedClassRoom', cursos.assignedClassRoom);
app.put('/course/assignedTeacher', cursos.assignedTeacher);
app.put('/course/assignedInstructor', cursos.assignedInstructor);
app.put('/course/deallocateTeacher', cursos.deallocateTeacher);
app.put('/course/deallocateInstructor', cursos.deallocateInstructor);
app.get('/course/list/:year/:semester', cursos.list);
app.put('/course/remove', cursos.remove);

//classRooms
app.get('/classroom/new', classroom.new);
app.get('/classroom/edit/:id', classroom.edit);
app.post('/classroom/create', classroom.create);
app.post('/classroom/update/:id', classroom.update);
app.get('/classroom/list/:year/:semester', classroom.list);

//subjects
app.get('/subject/new', subject.new);
app.post('/subject/create', subject.create);
app.post('/subject/update/:id', subject.update);
app.get('/subject/edit/:id', subject.edit);
app.get('/subject/list', subject.list);

//teachers
app.get('/teacher/new', teacher.new);
app.get('/teacher/edit/:id', teacher.edit);
app.post('/teacher/create', teacher.create);
app.post('/teacher/update/:id', teacher.update);
app.get('/teacher/list/:year/:semester', teacher.list);
app.put('/teacher/remove', teacher.remove);

//schedules
app.put('/schedule/assignedTeacher', schedule.assignedTeacher);
app.put('/schedule/deallocateClassroom', schedule.deallocateClassroom);
app.put('/schedule/deallocateTeacher', schedule.deallocateTeacher);
app.put('/schedule/deallocateSchedule', schedule.deallocateSchedule);
app.put('/schedule/unify', schedule.unify);


//reports
app.get('/report/offer/:year/:semester', report.offer);

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






