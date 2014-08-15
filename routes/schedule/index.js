var datos = require('../../extras/datos'),
    db = require('../../models')

	
exports.assignedTeacher = function(req, res) {

 	
	var idTeacher= req.body.idTeacher;
    var idCourseSchedule = req.body.idCourseSchedule;
  db.CourseSchedule.find(idCourseSchedule).success(function(schedule) {

		db.Teacher.find(idTeacher).success(function(teacher) {
			schedule.addTeacher(teacher);
			res.send('ok')
		})
  })
}

exports.deallocateClassroom = function(req, res){
	var idCourseSchedule = req.body.idCourseSchedule;
	  db.CourseSchedule.find(idCourseSchedule).success(function(courseSchedule) {
		courseSchedule.setClassRoom(undefined);
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

