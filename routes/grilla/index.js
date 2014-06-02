var datos = require('../../extras/datos'),
    db = require('../../models')

/*
 * GET grilla.
 */

exports.index = function(req, res) {

  db.Course.findAll({include: [ {model: db.CourseSchedule, as: 'Schedules'} ]}).success(function(courses) {
    res.render('grilla/index', {
      title: 'Grilla',
      datos: datos,
      cursos: courses
    })
  })

}


/*
 * GET grilla/:semester
 */

exports.semester = function(req, res) {

  var semester = parseInt(req.params.semester)

  // buscar los del "semester"
  db.Course.findAll({
    where: { semester: semester },
    include: [ {model: db.CourseSchedule, as: 'Schedules'} ]
  })
    .success(function(courses) {

      res.render('grilla/index', {
        title: 'Grilla',
        datos: datos,
        cursos: courses
      })
  })

}
