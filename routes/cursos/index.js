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
  
  res.render('cursos/curso', { title: 'Curso '+ code, curso: curso})
};


