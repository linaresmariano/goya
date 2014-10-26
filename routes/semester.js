var db = require('../models')


exports.new = function(req, res) {

  db.Semester.findAll({
    order: 'year DESC, semester DESC'
  }).success(function(semesters) {

    res.render('semester/new', {
      title: 'Crear un semester',
      semesters: semesters
    })

  })

}


exports.create = function(req, res) {

  var semester = req.body.semester;
  var year = req.body.year;

  db.Semester.getSemester(year, semester).success(function(semesters) {

    if(!semesters) {

      db.Semester.create({
        year: year,
        semester: semester
      }).success(function(semester) {

        var idClon = req.body.idSemesterToClone

        if(idClon) {

          db.Semester.cloneFromTo(idClon, semester).success(function(semesterCloned) {

            res.redirect('/')
            req.flash(typeMessage.SUCCESS, "El semestre se ha guardado correctamente")

          }).error(function(err) {
            showErrors(req, err)
            res.redirect('back')
          })

        } else {

          res.redirect('/')
          req.flash(typeMessage.SUCCESS, "El semestre se ha guardado correctamente")

        }

      }).error(function(err) {
        showErrors(req, err);
        res.redirect('back');
      })

    } else {

      req.flash(typeMessage.ERROR, "El semestre "+semester+" del año "+year+" ya existe")
      res.redirect('back');

    }

  })

}


