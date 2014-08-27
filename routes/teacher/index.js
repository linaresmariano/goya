var db = require('../../models')


exports.new = function(req, res) {

    res.render('teacher/new', {
      title: 'Crear Profesor'
    })
}


exports.create = function(req, res) {

	var code = req.body.code;
	var name = req.body.name;
	var year = req.body.year;
	var semester = req.body.semester;
	
	//Agragando un profesor al ultimo semestre

		db.Teacher.create({
							code: code,
							name: name
						}).success(function(teacher) {
									res.render('teacher/new', {
										title: 'Crear Profesor',
										feedbackpanel:{msj:'Profesor creado correctamente'}
									})
						})

}


exports.list = function(req, res){

	var year = req.params.year;
	var semester = req.params.semester;
	
	db.Teacher.findAll().success(function(teachers) {
	
		res.render('teacher/list', {
          title: 'Profesores',
          teachers:teachers
		});
	});
};


exports.remove = function(req, res){

	var idTeacher = req.body.idTeacher;
	
	db.Teacher.find(idTeacher).on('success', function(teacher) {
		  teacher.destroy().on('success', function(u) {
				res.send('ok');
		  })
	})
	
};



