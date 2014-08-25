var db = require('../../models')


exports.new = function(req, res) {

    res.render('classroom/new', {
      title: 'Crear un aula'
    })
}


exports.create = function(req, res) {

	var number = req.body.number;
	var name = req.body.name;
	var hasProyector = req.body.hasProyector;
	var description = req.body.description;
	var capacity = req.body.capacity;
	var numberOfComputers = req.body.numberOfComputers;
	
	var year = req.body.year;
	var semester = req.body.semester;
	
	//Agragando un profesor al ultimo semestre
		db.ClassRoom.create({
					number: number,
					name: name,
					hasProyector: hasProyector,
					description:description,
					capacity:capacity,
					numberOfComputers: numberOfComputers
		}).success(function(classRoom) {
						//semester.addsemesterClassroom(semesterClassroom);
						res.render('classroom/new', {
						  title: 'Crear Materia'
						});
		});
}


exports.list = function(req, res){

	
	var year = req.params.year;
	var semester = req.params.semester;
	
	db.ClassRoom.findAll().success(function(classRooms) {
	
		res.render('classroom/list', {
          title: 'Aulas',
          classRooms:classRooms
		});
	});
};



