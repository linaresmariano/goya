var db = require('../models')

	
exports.new = function(req, res) {

	 res.render('semester/new', {
      title: 'Crear un semester'
    })
}


exports.create = function(req, res) {

	var semester = req.body.semester;
	var year = req.body.year;
	
	db.Semester.create({
							year: year,
							semester: semester
						}).success(function(teacher) {
									showFeedbackPanel(res,'Semestre creado correctamente',typeMessage.SUCCESS);
									res.render('semester/new', {
										title: 'Crear un semester',
									})
						})
}


