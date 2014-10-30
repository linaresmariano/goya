var db = require('../models')


exports.new = function(req, res) {
  res.render('classroom/new', {
    title: 'Crear un aula'
  })
}


exports.edit = function(req, res) {

  var id = req.params.id

  db.ClassRoom.find(id).success(function(classroom) {

    res.render('classroom/new', {
      title: 'Editar un aula',
      classroom: classroom
    })
  })
}

exports.grid = function(req, res) {

  var semester = req.params.semester;
  var year = req.params.year;

  // buscar los del "semester"
  db.Semester.find({
     where: {
              'year': year ,
			  'semester':semester
            },
	include: [ {	model: db.Course, as: 'Courses' ,require:false,
						include: [ 	{model: db.CourseSchedule, as: 'schedules',require:false,
										include: [ 	{model: db.PatchSchedule, as: 'Patch',require:false},
													{model: db.SemesterClassRoom, as: 'SemesterClassRoom',require:false,
														include: [ 	{model: db.ClassRoom, as: 'ClassRoom',require:false}]}]},
]
						}]
  }).success(function(semester) {
			res.render('classroom/grid', {
				title: 'Aulas',
				semester: semester 
			  })
		
  })

}


exports.create = function(req, res) {

  var number = req.body.number;
  var name = req.body.name;
  var hasProyector = req.body.hasProyector;
  var description = req.body.description;
  var capacity = req.body.capacity;
  var numberOfComputers = req.body.numberOfComputers;

  var year = req.body.year;
  var semester = req.body.semester;

  //Agragando un profesor al ultimo semestre
  db.ClassRoom.create({

    number: number,
    name: name,
    hasProyector: hasProyector,
    description: description,
    capacity: capacity,
    numberOfComputers: numberOfComputers

  }).success(function(classRoom) {
	req.flash(typeMessage.SUCCESS, 'Aula creada correctamente');
    res.render('classroom/new', {
      title: 'Crear Materia'
    })

  }).error(function(err) {
	showErrors(req,err);
    res.render('classroom/new', {
      title: 'Crear un aula',
      classroom: req.body
    })
    
  })
}


exports.list = function(req, res){

  var year = req.params.year
  var semester = req.params.semester

  db.ClassRoom.findAll().success(function(classrooms) {

    res.render('classroom/list', {
      title: 'Aulas',
      classRooms: classrooms
    })

  })
}


exports.update = function(req, res) {

  var id = req.params.id

  var number = req.body.number
  var name = req.body.name
  var hasProyector = req.body.hasProyector
  var description = req.body.description
  var capacity = req.body.capacity
  var numberOfComputers = req.body.numberOfComputers

  var year = req.body.year
  var semester = req.body.semester

  db.ClassRoom.find(id).success(function(classroom) {
    if (classroom) { // if the record exists in the db
      classroom.updateAttributes({
        number: number,
        name: name,
        hasProyector: hasProyector,
        description: description,
        capacity: capacity,
        numberOfComputers: numberOfComputers
      }).success(function(classroomUpdated) {

        res.redirect('classroom/list/'+year+'/'+semester)
        req.flash(typeMessage.SUCCESS, "El aula se ha guardado correctamente")

      }).error(function(err) {

        req.flash(typeMessage.ERROR, err.name[0])

      })

    }
  }).error(function(err) {
	showErrors(req,err);
    res.redirect('classroom/list/'+year+'/'+semester)
  })
  
}


exports.remove = function(req, res){

  var id = req.body.id

  db.ClassRoom.find(id).success(function(classroom) {
    if(classroom) {
      classroom.destroy().success(function(u) {
        res.send('ok');
      })
    }
  })

}

