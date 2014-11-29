var db = require('../models')


exports.new = function(req, res) {

  db.Career.findAll().success(function(careers) {

    res.render('subject/new', {
      title: 'Crear Materia',
      careers: careers
    })

  })

}


exports.create = function(req, res) {

  var dictates = req.body.dictates

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

    // Si tiene carreras asociadas, persistirlas
    if (dictates) {
      db.Career.findAll({
        where: {
          id: dictates
        }
      }).success(function(careers) {
        subject.setDictateCareers(careers).success(function(associatedCareers) {

          showFeedbackPanel(res, 'Materia creada correctamente', typeMessage.SUCCESS)
          exports.new(req, res)

        })
      }).error(function(err) {
        res.redirect('back')
        req.flash(typeMessage.ERROR, 'La materia no tiene carreras asiciadas');
      })

    } else {

      showFeedbackPanel(res, 'Materia creada correctamente', typeMessage.SUCCESS)
      exports.new(req, res)

    }

  }).error(function(err) {
    res.redirect('back')
    showErrors(req, err);
  })

}


exports.list = function(req, res) {

  db.Subject.findAll().success(function(subjects) {

    res.render('subject/list', {
      title: 'Materias',
      subjects: subjects
    })
  })

}


exports.edit = function(req, res) {

  var id = req.params.id

  db.Subject.find({
    include: [{
      model: db.Career,
      as: 'dictateCareers',
      require: false
    }],
    where: {
      'id': id
    }
  }).success(function(subject) {

    check(subject, 'La materia no existe, debe crearla.', res)

    db.Career.findAll().success(function(careers) {
      res.render('subject/new', {
        title: 'Editar Materia',
        subject: subject,
        careers: careers
      })

    })
  })

}


exports.update = function(req, res) {

  var id = req.params.id
  var dictates = req.body.dictates
  console.log(req.body.careerId)

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
      }).success(function(subjectUpdated) {

        // Si tiene carreras asociadas, persistirlas
        if (dictates) {
          db.Career.findAll({
            where: {
              id: dictates
            }
          }).success(function(careers) {
            subjectUpdated.setDictateCareers(careers).success(function(associatedCareers) {

              res.redirect('subject/list')
              req.flash(typeMessage.SUCCESS, "La materia se ha guardado correctamente")

            })
          }).error(function(err) {

            req.flash(typeMessage.ERROR, 'La materia no tiene carreras asiciadas');
            exports.new(req, res)
          })

        } else {

          res.redirect('subject/list')
          req.flash(typeMessage.SUCCESS, "La materia se ha guardado correctamente")

        }

      }).error(function(err) {
        showErrors(req, err);
        res.redirect('back');
      })
    }
  })

}


exports.remove = function(req, res) {

  var id = req.body.id

  db.Subject.find(id).success(function(subject) {
    if (subject) {
      subject.destroy().success(function(u) {
        res.send('ok');
      })
    }
  })

}