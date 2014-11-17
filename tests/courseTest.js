var db = require('./');
var  sequelize= db.sequelize;


exports.testAssignedTeacher = function (test) {			
    db.Course.find(1).success(function(course) {
        idTeacher=1;
        db.Semester.find(1).success(function(semester){
		    course.assignedTeacher(idTeacher,semester,function(){
			
				course.getSemesterTeachers().success(function(semesterTeachers){
				
                    test.equal(semesterTeachers.length,1,"SemesterTeacher lenght should be " + 1);
					
					semesterTeachers[0].getTeacher().success(function(teacher){
					    test.equal(teacher.id,idTeacher,"teacher.id  should be " + 1);
						test.done();
					})
					
				});

		    });
        });
    })		
}

exports.testAssignedInstructor = function (test) {			
    db.Course.find(1).success(function(course) {
        idTeacher=1;
        db.Semester.find(1).success(function(semester){
		
		    course.assignedInstructor(idTeacher,semester,function(){
			
				course.getSemesterInstructors().success(function(semesterInstructors){
                    test.equal(semesterInstructors.length,1,"SemesterInstructors lenght should be " + 1);
					
					semesterInstructors[0].getTeacher().success(function(teacher){
					    test.equal(teacher.id,idTeacher,"teacher.id  should be " + idTeacher);
						test.done();
					})
					
				});

		    });
			
        });
    })		
}
