var datos = require('../../models/datos');

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

  code = req.params.id
  comision = req.params.comision
  curso = ''

  datos.cursos_cuatrimestrales.forEach(function(entry) {
    if(entry.code == code && entry.comision == comision) {
      curso = entry;
    }
  });
  
  res.render('cursos/curso', { title: 'Curso '+ code, curso: curso, datos: datos })
};


