var datos = require('../../models/datos');
var CursoCuatrimestral = require('../../models/curso_cuatrimestral')

/*
 * GET grilla.
 */

exports.index = function(req, res){

   CursoCuatrimestral.find(/*{'horarios.dia':1},*/gotCursosCuatrimestrales);
   function gotCursosCuatrimestrales (err, cursos) {
		if (err) {
		  console.log(err)
		  return next()
		}
		res.render('grilla/index', { title: 'Grilla', datos: datos, cursosAsignados: cursos });
		
	}

};


