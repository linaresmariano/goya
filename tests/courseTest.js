var db = require('./');
var sequelize = db.sequelize;


exports.testAssignedTeacher = function(test) {
  db.Course.find(1).success(function(course) {
    var idTeacher = 1;
    db.Semester.find(1).success(function(semester) {
      course.assignedTeacher(idTeacher, semester, function() {

        course.getSemesterTeachers().success(function(semesterTeachers) {

          test.equal(semesterTeachers.length, 1, "SemesterTeacher length should be " + 1);

          semesterTeachers[0].getTeacher().success(function(teacher) {
            test.equal(teacher.id, idTeacher, "teacher.id  should be " + 1);
            test.done();
          })

        });

      });
    });
  })
}

exports.testAssignedInstructor = function(test) {
  db.Course.find(1).success(function(course) {
    var idTeacher = 2;
    db.Semester.find(1).success(function(semester) {

      course.assignedInstructor(idTeacher, semester, function() {

        course.getSemesterInstructors().success(function(semesterInstructors) {
          test.equal(semesterInstructors.length, 1, "SemesterInstructors length should be " + 1);

          semesterInstructors[0].getTeacher().success(function(teacher) {
            test.equal(teacher.id, idTeacher, "teacher.id  should be " + idTeacher);
            test.done();
          })

        });

      });

    });
  })
}


exports.testDeallocateTeacher = function(test) {
  var idCourse = 1;
  var idTeacher = 1;
  db.Course.deallocateTeacher(idCourse, idTeacher, function() {
    db.Course.find(idCourse).success(function(course) {
      course.getSemesterTeachers().success(function(semesterTeachers) {
        test.equal(semesterTeachers.length, 0, "SemesterTeacher length should be " + 0);
        test.done();

      });
    });
  });
}

exports.testDeallocateInstructor = function(test) {
  var idCourse = 1;
  var idTeacher = 2;
  db.Course.deallocateInstructor(idCourse, idTeacher, function() {
    db.Course.find(idCourse).success(function(course) {
      course.getSemesterInstructors().success(function(semesterInstructors) {
        test.equal(semesterInstructors.length, 0, "SemesterInstructors length should be " + 0);
        test.done();

      });
    });
  });
}