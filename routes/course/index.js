var datos = require('../../extras/datos'),
    db = require('../../models')


/*
 * GET cursos.
 */

exports.index = function(req, res){

  db.Course.findAll().success(function(courses) {
    res.render('course/index', {
      title: 'Cursos',
      datos: datos,
      cursos: courses
    })
  })

};


/*
 * GET cursos/:code_curso.
 */

exports.curso = function(req, res) {

  code = req.params.id
  curso = ''

  datos.cursos.forEach(function(entry) {
    if(entry.code == code) {
      curso = entry;
    }
  });
  
  res.render('cursos/curso', { title: 'Curso '+ code, curso: curso, datos: datos })
};


/*
 * GET cursos/:code_curso/:comision.
 */

exports.commission = function(req, res) {

  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  code = req.params.id
  commission = req.params.commission
  curso = ''

  db.Course.findAll({include: [
    {model: db.CourseSchedule, as: 'Schedules'},
    {model: db.Teacher, as: 'Teachers'}
  ]}).success(function(courses) {
    courses.forEach(function(entry) {
      if(entry.code == code && entry.commission == commission) {

        res.render('cursos/curso', {
          title: 'Curso '+ code,
          curso: entry,
          datos: datos,
          weekday: weekday
        });
      }
    });
  })
};



exports.actualizar = function(req, res) {

  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      day: req.param('day'),
      hour: req.param('hour')
    }, ['day', 'hour'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

}

exports.actualizarFin = function(req, res) {
  //Actualiza el horario con el id correspondiente
  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      duration: req.param('duration')
    }, ['duration'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

}



exports.update_profe = function(req, res) {
  //Actualiza el horario con el id correspondiente
  db.CourseSchedule.find(req.param('id')).success(function(schedule) {

    schedule.updateAttributes({
      duration: req.param('duration')
    }, ['duration'])
      .success(function() {
        res.send('ok')
      })
      .error(function(err) {
        res.send('error')
      })
  })

  Curso.findOneAndUpdate(
    {'code': req.param('code'), 'comision': req.param('comision')},
    {'horarios.$.duracion':req.param('duracion')},
    function(err,curso) {
      res.send(err ? 'error' : 'ok');
  });
}

