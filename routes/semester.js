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
									req.flash(typeMessage.SUCCESS, 'Semestre creado correctamente');
									res.render('semester/new', {
										title: 'Crear un semester',
									})
						}).error(function(err) {
							showErrors(req,err);
							res.redirect('back');
						})
}


