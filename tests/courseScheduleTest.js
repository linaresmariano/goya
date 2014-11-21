var db = require('./');
var  sequelize= db.sequelize;


exports.testAssignedTeacher = function (test) {			
    db.CourseSchedule.find(1).success(function(schedule) {
        var idTeacher=1;
        db.Semester.find(1).success(function(semester){
		    schedule.assignedTeacher(idTeacher,semester,function(){
			
				schedule.getSemesterTeachers().success(function(semesterTeachers){
				
                    test.equal(semesterTeachers.length,1,"SemesterTeacher length should be " + 1);
					
					semesterTeachers[0].getTeacher().success(function(teacher){
					    test.equal(teacher.id,idTeacher,"teacher.id  should be " + 1);
						test.done();
					})
					
				});

		    });
        });
    })		
}


