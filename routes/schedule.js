var db = require('../models')

	
exports.assignedTeacher = function(req, res) {

	var idTeacher= req.body.idTeacher;
    var idCourseSchedule = req.body.idCourseSchedule;
  	var year = req.body.year;
    var semester = req.body.semester;
	//Asigna un teacher a un horario de un curso para un semestre
	db.Semester.teacherAssignedToASchedule(idTeacher,idCourseSchedule,semester,year,function(result) {
			res.send('ok');
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
							
	db.CourseSchedule.deallocateTeacher(idCourseSchedule,idTeacher,function(){
		res.send('ok');
	});
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

exports.update= function(req, res) {

	  db.CourseSchedule.find({where: {'id':req.body.id},
			  include: [{model: db.PatchSchedule, as: 'Patch', require: false},
						{model: db.SemesterClassRoom, as: 'SemesterClassRoom', require: false,
							  include: [{model: db.ClassRoom, as: 'ClassRoom', require: false},
										{model: db.Semester, as: 'Semester', require: false}]}]}).success(function(schedule){	
										
		idclassRoom=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.classRoom.id;
		year=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.semester.year;	
		semester=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.semester.semester;
		
		schedule.day=parseInt(req.body.day);
		schedule.hour=parseInt(req.body.hour);
		schedule.minutes=parseInt(req.body.minutes);
		
		db.ClassRoom.checkClassroomUsed(idclassRoom,schedule,year,semester,function(msj){
			if(!msj){
				    schedule.updateAttributes({
					  day: req.body.day,
					  hour: req.body.hour,
					  minutes:req.body.minutes,
					}).success(function() {
					  res.send('ok')
					})
			}else{
				res.send(msj);
			}
		});
		
	  })
}

exports.updateEnd = function(req, res) {
  //Actualiza el horario con el id correspondiente
	db.CourseSchedule.find({where: {'id':req.body.id},
				  include: [{model: db.PatchSchedule, as: 'Patch', require: false},
							{model: db.SemesterClassRoom, as: 'SemesterClassRoom', require: false,
								  include: [{model: db.ClassRoom, as: 'ClassRoom', require: false},
											{model: db.Semester, as: 'Semester', require: false}]}]}).success(function(schedule){
											
			idclassRoom=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.classRoom.id;
			year=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.semester.year;	
			semester=!schedule.semesterClassRoom ? -1 : schedule.semesterClassRoom.semester.semester;
			
			schedule.durationHour=parseInt(req.body.durationHour);
			schedule.durationMinutes=parseInt(req.body.durationMinutes);
			db.ClassRoom.checkClassroomUsed(idclassRoom,schedule,year,semester,function(msj){
				if(!msj){
					schedule.updateAttributes({
						durationHour: req.body.durationHour,
						durationMinutes: req.body.durationMinutes,
						}).success(function() {	
							res.send('ok')
						})
				}else{
					res.send(msj);
				}
			});
	})
}

exports.assignedClassRoom = function(req, res) {

  var idClassRoom = req.body.idClassRoom
  var idCourseSchedule = req.body.idCourseSchedule
  var year = req.body.year
  var semester = req.body.semester
  
  db.CourseSchedule.find({where: {'id':idCourseSchedule},
          include: [{model: db.PatchSchedule, as: 'Patch', require: false}]}).success(function(schedule){
	db.ClassRoom.checkClassroomUsed(idClassRoom,schedule,year,semester,function(msj){
		if(!msj){
			db.CourseSchedule.assignedClassRoom(idClassRoom, idCourseSchedule, year, semester);
			res.send('ok')
		}else{
			res.send(msj);
		}
	});
  }) 
}
