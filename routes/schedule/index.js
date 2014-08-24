var datos = require('../../extras/datos'),
    db = require('../../models')

	
exports.assignedTeacher = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourseSchedule = req.body.idCourseSchedule;
  	var year = req.body.year;
    var semester = req.body.semester;
  db.CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {

		db.SemesterTeacher.find({
			where: {'Teacher.id':idTeacher,'Semester.year':year,'Semester.semester':semester},
			include: [ {	model: db.Teacher, as: 'Teacher' ,require:false },
					{	model: db.Semester, as: 'Semester' ,require:false }]
			}
		).success(function(semesterTeacher) {
		
			if(semesterTeacher == undefined){
				
				db.Teacher.find(idTeacher).success(function(teacher) {
					var newSemesterTeacher= db.SemesterTeacher.create({
					}).success(function(newSemesterTeacher) {
										newSemesterTeacher.setTeacher(teacher);
										courseSchedule.addSemesterTeacher(newSemesterTeacher);	
										db.Semester.find({where: {'year':year,'semester':semester}}).success(function(semester) {
											semester.addSemesterTeacher(newSemesterTeacher);
											res.send('ok')
										});
																				
								});
				
				})
				console.log('el profesor es nulo');
			}else{
				console.log('el profesor no es nulo');
				semesterTeacher.setTeacher(teacher);
										courseSchedule.addSemesterTeacher(semesterTeacher);	
										db.Semester.find({where: {'year':year,'semester':semester}}).success(function(semester) {
											semester.addSemesterTeacher(semesterTeacher);
											res.send('ok')
										});
			}
			
			
		})
  

  })
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
	  db.CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
		courseSchedule.updateAttributes({
				hour: -1
			}).success(function() {
				res.send('ok')
			})
	  })

};


exports.deallocateTeacher = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	var idTeacher= req.body.idTeacher;
	  db.CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
		 db.Teacher.find(idTeacher).success(function(teacher) {
			courseSchedule.removeTeacher(teacher);
			res.send('ok')
		 });
		
	  })
};

