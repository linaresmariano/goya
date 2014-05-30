var datos = require('../../models/datos');
var Curso = require('../../models/curso')

/*
 * GET grilla.
 */

exports.index = function(req, res){

   Curso.find(/*{'horarios.dia':1},*/gotCursos);
   function gotCursos (err, cursos) {
		if (err) {
		  console.log(err)
		  return next()
		}
		res.render('grilla/index', { title: 'Grilla', datos: datos, cursos: cursos });
		
	}

};


/*
 * GET grilla/:cuatrimestre
 */

exports.cuatrimestre = function(req, res) {

  var cuatrimestre = req.params.cuatrimestre

  // buscar los del "cuatrimestre"
  Curso.find(/*{'horarios.dia':1},*/gotCursos);

  function gotCursos (err, cursos) {
    if (err) {
      console.log(err)
      return next()
    }
  
    res.render('grilla/index', { title: 'Grilla', datos: datos, cursos: cursos });
  }

};

