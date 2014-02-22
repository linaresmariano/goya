var datos = require('../../models/datos');
var Curso = require('../../models/curso')
/*
 * GET cursos.
 */

exports.index = function(req, res){
  res.render('cursos/index', { title: 'Cursos', datos: datos });
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

  datos.cursos_cuatrimestrales.forEach(function(entry) {
    if(entry.code == code && entry.comision == comision) {
      curso = entry;
    }
  });
  
  res.render('cursos/curso', {
    title: 'Curso '+ code,
    curso: curso,
    datos: datos,
    weekday: weekday
  })
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

						})
  
};



