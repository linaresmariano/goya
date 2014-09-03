var db = require('../../models')


exports.new = function(req, res) {

    res.render('subject/new', {
      title: 'Crear Materia'
    })
}


exports.create = function(req, res) {

  db.Subject.create({

    code: req.body.code,
    name: req.body.name,
    area: req.body.area,
    core: req.body.core,
    period: req.body.period,
    modality: req.body.modality,
    ocode: req.body.ocode,
    credits: req.body.credits,
    capacity: req.body.capacity

  }).success(function(course) {
	showFeedbackPanel(res,'Materia creada correctamente',typeMessage.SUCCESS);
    exports.new(req, res);	
    
  }).error(function(err) {
        showFeedbackPanel(res,err.name[0],typeMessage.ERROR);
		exports.new(req, res);	
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

