var db = require('../../models')


exports.new = function(req, res) {

    res.render('teacher/new', {
      title: 'Crear Profesor'
    })
}


exports.create = function(req, res) {

	var code = req.body.code;
	var name = req.body.name;
	
	db.Semester.find({
		where: {
				  'year': 2014 ,
				  'semester':1
				},
		include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}]
	}).success(function(semester) {
					db.Teacher.create({
										code: code,
										name: name
									}).success(function(teacher) {
												semester.addTeacher(teacher);
												res.render('teacher/new', {
													title: 'Crear Profesor'
												})
									})
				})
}



