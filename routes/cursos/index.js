var datos = require('../../extras/datos'),
    db = require('../../models')


/*
 * GET cursos.
 */

exports.index = function(req, res){

  db.Course.findAll().success(function(courses) {
    res.render('cursos/index', {
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

exports.comision = function(req, res) {

  weekday = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  code = req.params.id
  comision = req.params.comision
  curso = ''

  db.Course.findAll({include: [ {model: db.CourseSchedule, as: 'Schedules'} ]}).success(function(courses) {
    courses.forEach(function(entry) {
      if(entry.code == code && entry.commission == comision) {

        res.render('cursos/curso', {
          title: 'Curso '+ code,
          curso: entry,
          datos: datos,
          weekday: weekday
        });
      }
    });
  })

  // Curso.find(function(err, cursos) {
  //   if (err) {
  //     console.log(err);
  //     return next()
  //   }

  //   cursos.forEach(function(entry) {
  //     if(entry.code == code && entry.comision == comision) {
  //       res.render('cursos/curso', {
  //         title: 'Curso '+ code,
  //         curso: entry,
  //         datos: datos,
  //         weekday: weekday
  //       });
  //     }
  //   });
  // });
};



exports.actualizar = function(req, res) {
  //Actualiza el horario con el id correspondiente
  Curso.findOneAndUpdate({'horarios._id':req.param('id')}, 
			{'$set': {'horarios.$.dia':req.param('dia'),'horarios.$.hora':req.param('hora')}}
			,function(err,curso){
				if(err){
					res.send('error');
				}else{
					res.send('ok');
				}

			});
  
};

exports.actualizarFin = function(req, res) {
  //Actualiza el horario con el id correspondiente
  Curso.findOneAndUpdate({'horarios._id':req.param('id')}, 
			{'$set': {'horarios.$.duracion':req.param('duracion')}}
			,function(err,curso){
				if(err){
					res.send('error');
				}else{
					res.send('ok');
				}

			});
  
};



exports.update_profe = function(req, res) {
  Curso.findOneAndUpdate(
    {'code': req.param('code'), 'comision': req.param('comision')},
    {'horarios.$.duracion':req.param('duracion')},
    function(err,curso) {
      res.send(err ? 'error' : 'ok');
  });
}

