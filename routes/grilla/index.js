var datos = require('../../models/datos');
/*
 * GET grilla.
 */

exports.index = function(req, res){

   cursos = [
      {
            id: 1,
            titulo: 'PCONC',
            dia: 2,
            hora: 14,
            duracion: 3,
            color: 'red'
      },
      {
            id: 2,
            titulo: 'INTRO',
            dia: 4,
            hora: 14,
           duracion: 3,
            color: 'yellow'
      },
      {
            id: 3,
            titulo: 'EPERS',
            dia: 2,
            hora: 19,
            duracion: 3,
            color: 'blue'
      },
	  {
            id: 4,
            titulo: 'MATE2',
            dia: 5,
            hora: 15,
            duracion: 3,
            color: 'pink'
      },
	  {
            id: 5,
            titulo: 'LAB',
            dia: 5,
            hora: 15,
            duracion: 3,
            color: 'white'
      }
  ]

  res.render('grilla/index', { title: 'Grilla', datos: datos, , cursosAsignados: JSON.stringify(cursos) });
};


