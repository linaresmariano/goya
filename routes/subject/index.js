var db = require('../../models')


exports.new = function(req, res) {

  db.Career.findAll().success(function(careers) {
    
    res.render('subject/new', {
      title: 'Crear Materia',
      careers: careers
    })

  })

}


exports.create = function(req, res) {

  console.log(req.body.dictates)

  db.Subject.create({

    nick: req.body.nick,
    name: req.body.name,
    area: req.body.area,
    core: req.body.core,
    period: req.body.period,
    ocode: req.body.ocode,
    credits: req.body.credits,
    CareerId: req.body.careerId

  }).success(function(subject) {

    if(req.body.dictates != undefined) {
      for(var i=0; i < req.body.dictates.length; i++) {
        db.Career.find({
          where:{ 'id': req.body.dictates[i] }
        }).success(function(career) {
          
          career.addSubject(subject)

        })
      }
    }

    showFeedbackPanel(res, 'Materia creada correctamente', typeMessage.SUCCESS)
    exports.new(req, res)
    
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

  var id = req.params.id

  console.log(id)

  db.Subject.find({
    include: [ {model: db.Career, as: 'dictateCareers', require:false} ],
    where:{ 'id': id }
  }).success(function(subject) {
    db.Career.findAll().success(function(careers) {
      res.render('subject/edit', {
        title: 'Editar Materia',
        subject: subject,
        careers: careers
      })

    })
  })
  
}


exports.update = function(req, res) {

  var id = req.params.id

  db.Subject.find(id).success(function(subject) {
    if (subject) { // if the record exists in the db
      subject.updateAttributes({
        nick: req.body.nick,
        name: req.body.name,
        area: req.body.area,
        core: req.body.core,
        period: req.body.period,
        ocode: req.body.ocode,
        credits: req.body.credits,
        CareerId: req.body.careerId
      }).success(function() {

        res.redirect('subject/list')
        req.flash(typeMessage.SUCCESS, "La materia se ha guardado con éxito")

      })
    }
  }).error(function(err) {

    res.redirect('subject/list')
    req.flash(typeMessage.ERROR, err.name[0])

  })
  
}

