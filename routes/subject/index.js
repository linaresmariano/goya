var db = require('../../models')


exports.new = function(req, res) {

    res.render('subject/new', {
      title: 'Crear Materia'
    })
}


exports.create = function(req, res) {

	var code = req.body.code;
	var name = req.body.name;
	
	db.Subject.create({
				code: code,
				name: name
			}).success(function(course) {
					res.render('subject/new', {
					  title: 'Crear Materia'
					})
			})

}


exports.list = function(req, res){

	var year = req.params.year;
	var semester = req.params.semester;
	
	db.Subject.findAll().success(function(subjects) {
	
		res.render('subject/list', {
          title: 'Materias',
          subjects:subjects
		});
	});
};



