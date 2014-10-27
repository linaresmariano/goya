var db = require('../models')

	
exports.assignedTeacher = function(req, res) {

	var idTeacher= req.body.idTeacher;
    var idCourseSchedule = req.body.idCourseSchedule;
  	var year = req.body.year;
    var semester = req.body.semester;
	//Asigna un teacher a un horario de un curso para un semestre
	db.Semester.teacherAssignedToASchedule(idTeacher,idCourseSchedule,semester,year,function(result) {
			//La idea de este chequeo es mostrar mensajes de error o otro tipo de mensajes
			if(result == undefined){
				res.json({success:true}); // para probar {succes:false,type:'Error Fatal',message:'Un Ejemplo de error'}
			}else{
				if(result.success){
					res.json({success:true,message:result.message});
				}else{
					res.json({success:false,type:result.type,message:result.message});
				}
			}
			
	});
}

exports.separateSchedule=function(req, res){
	var idSchedule=req.body.idSchedule;
	var idCourse=req.body.idCourse;
	db.CourseSchedule.find({
     where: {
              'id': idSchedule 
            },
	include: [{model: db.PatchSchedule, as: 'Patch' ,require:false}]
  }).success(function(schedule) {
		
		db.Course.find(idCourse).success(function(course) {
			schedule.removeCourse(course);
			
			var scheduleToSave = db.CourseSchedule.build({
			  type: schedule.type,
			  day: schedule.day,
			  hour: schedule.hour,
			  minutes: schedule.minutes,
			  durationHour: schedule.durationHour,
			  durationMinutes:  schedule.durationMinutes
			})

			scheduleToSave.save().success(function(newSchedule) {
				newSchedule.addCourse(course);
				clonePatch(schedule.patch).save().success(function(newPatch) {
					newSchedule.setPatch(newPatch);
					res.send(newSchedule.id+'')
				});
			});
		});
	});
}

function clonePatch(patch){
	return db.PatchSchedule.build({
				visibility: patch.visibility,
				extraHour:  patch.extraHour,
				extraDuration: patch.extraDuration,
			})
}

exports.unify = function(req, res){
        var schedules=req.body.schedules;
        var firstSchedule=schedules[0];
        schedules.splice(0,1)
        for(i=0;i<schedules.length;i++ ){
        
            var unify=function(schedule){
                var scheduleParam=schedule;
                db.CourseSchedule.find(scheduleParam.id).success(function(schedule) {
						var scheduleFind=schedule;
						schedule.destroy().success(function() {	
							db.CourseSchedule.find(firstSchedule.id).success(function(firstSchedule) {
										for(x=0;x < scheduleParam.courses.length;x++){
											addCourse=function(courseParam,firstSchedule){
												db.Course.find(courseParam.id).success(function(course) {
														scheduleFind.removeCourse(course);
														course.removeSchedule(scheduleFind);
														firstSchedule.addCourse(course);
													});
												
											}
											addCourse(scheduleParam.courses[x],firstSchedule);
										}
							});
                        })

                })
            }
            
            unify(schedules[i]);
        }
        res.send('ok');
};

exports.deallocateClassroom = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	  db.CourseSchedule.deallocateClassRoom(idCourseSchedule,function() {
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


exports.delete = function(req, res) {
  var id = req.body.id

  db.CourseSchedule.find(id).success(function(schedule) {
    if(schedule) {
      schedule.destroy().success(function(u) {
        res.send('ok');
      })
    }
  })
}
