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
	db.Semester.find({
		include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}],
		where:{ 'year': year,'semester':semester}
	}).success(function(semester) {
					console.log(semester);
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



