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



