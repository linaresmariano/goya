var datos = require('../../extras/datos'),
    db = require('../../models')

	
exports.assignedTeacher = function(req, res) {

	var idTeacher= req.body.idTeacher;
    var idCourseSchedule = req.body.idCourseSchedule;
  	var year = req.body.year;
    var semester = req.body.semester;
	//Asigna un teacher a un horario de un curso para un semestre
	db.Semester.teacherAssignedToASchedule(idTeacher,idCourseSchedule,semester,year,function(result) {
			//La idea de este chequeo es mostrar mensajes de error o otro tipo de mensajes
			if(result == undefined){
				res.json({succes:true}); // para probar {succes:false,type:'Error Fatal',message:'Un Ejemplo de error'}
			}else{
				if(result.success){
					res.json({succes:true,message:result.message});
				}else{
					res.json({succes:false,type:result.type,message:result.message});
				}
			}
			
	});
}

exports.deallocateClassroom = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	  db.CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
		courseSchedule.setSemesterClassRoom(undefined);
		res.send('ok')
	  })

};

exports.deallocateSchedule = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	db.CourseSchedule.deallocate(idCourseSchedule,function(){
		res.send('ok');
	});
};


exports.deallocateTeacher = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	var idTeacher= req.body.idTeacher;
							
	db.CourseSchedule.find({
		where:{id:idCourseSchedule},
		include: [ {model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
												include: [ 	{model: db.Teacher, as: 'Teacher',require:false}]}]
	}).success(function(courseSchedule) {				
		for(n=0;n < courseSchedule.semesterTeachers.length;n++){
			console.log(courseSchedule.semesterTeachers[n]);	
			if(courseSchedule.semesterTeachers[n].teacher.id == idTeacher){
				courseSchedule.removeSemesterTeacher(courseSchedule.semesterTeachers[n]);
				
				break;
			}
		}
		res.send('ok')
	  })
};

