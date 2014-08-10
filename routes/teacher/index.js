var db = require('../../models')


exports.new = function(req, res) {

    res.render('teacher/new', {
      title: 'Crear Profesor'
    })
}


exports.create = function(req, res) {

	var code = req.body.code;
	var name = req.body.name;
	
	//Agragando un profesor al ultimo semestre
	db.Semester.findAll({
		include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}],
		order:' year DESC ,semester DESC'
	}).success(function(semester) {
					console.log(semester);
					db.Teacher.create({
										code: code,
										name: name
									}).success(function(teacher) {
												semester[0].addTeacher(teacher);
												res.render('teacher/new', {
													title: 'Crear Profesor'
												})
									})
				})
}



