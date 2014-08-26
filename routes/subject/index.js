var db = require('../../models')


exports.new = function(req, res) {

    res.render('subject/new', {
      title: 'Crear Materia'
    })
}


exports.create = function(req, res) {

	var code = req.body.code;
	var name = req.body.name;
  var area = req.body.area;
  var core = req.body.core;
  var period = req.body.period;
  var modality = req.body.modality;
	
	db.Subject.create({
				code: code,
				name: name,
        area: area,
        core: core,
        period: period,
        modality: modality
			}).success(function(course) {
					res.render('subject/new', {
					  title: 'Crear Materia'
					})
			})

}


exports.list = function(req, res){

	
	db.Subject.findAll().success(function(subjects) {
	
		res.render('subject/list', {
          title: 'Materias',
          subjects:subjects
		});
	});
};


exports.edit = function(req, res) {

  res.render('subject/edit', {
    title: 'Editar Materia'
  })
  
}

