var db = require('../models')

db.Course.drop()

db.Course.create({
	code: 'EPERS',
	commission: 1,
	semester: 12014,
	enrolled: 23
})

// curso = new Curso();
// 	  curso.code= 'EPERS';
// 	  curso.comision = 1;
// 	  curso.cuatrimestre = 12014;
// 	  curso.inscriptos = 25;
// 	  curso.configVista.color='red';
// 	  curso.requisitos.computadoras =true;
// 	  curso.horarios=[{
// 				dia : 1,
// 				hora: 16,
// 				minutos: 0,
// 				duracion: 6,
// 				tipo: 'Teorica/Practica'
// 			}]
// curso.save();

// curso= new Curso();
// 	  curso.code= 'INTRO';
// 	  curso.comision = 2;
// 	  curso.cuatrimestre = 12014;
// 	  curso.inscriptos = 30;
// 	  curso.configVista.color='pink';
// 	  curso.requisitos.computadoras =true;
// 	  curso.horarios=[{
// 				dia : 1,
// 				hora: 9,
// 				minutos: 0,
// 				duracion: 3,
// 				tipo: 'Teorica'
// 			},
// 			{
// 				dia : 3,
// 				hora: 9,
// 				minutos: 0,
// 				duracion: 3,
// 				tipo: 'Practica'
// 			},
// 			{
// 				dia : -1,
// 				hora: -1,
// 				minutos: 0,
// 				duracion: 3,
// 				tipo: 'Practica'
// 			}
// 			]
// curso.save();


// curso= new Curso();
// 	  curso.code= 'ORGA';
// 	  curso.comision = 4;
// 	  curso.cuatrimestre = 12014;
// 	  curso.inscriptos = 45;
// 	  curso.configVista.color='green';
// 	  curso.requisitos.computadoras =true;
// 	  curso.horarios=[{
// 				dia : 5,
// 				hora: 14,
// 				minutos: 0,
// 				duracion: 4,
// 				tipo: 'Teorica'
// 		         }]

// curso.save();
				 
// curso= new Curso();
// 	  curso.code= 'SEGI';
// 	  curso.comision = 1;
// 	  curso.cuatrimestre = 12014;
// 	  curso.inscriptos = 20;
// 	  curso.configVista.color='yellow';
// 	  curso.requisitos.computadoras =true;
// 	  curso.horarios=[{
// 				dia : -1,
// 				hora: -1,
// 				minutos: 0,
// 				duracion: 4,
// 				tipo: 'Teorica/Practica'
// 			 }]
// curso.save();
