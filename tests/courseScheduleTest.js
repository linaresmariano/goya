var db = require('./');
var sequelize = db.sequelize;


exports.testAssignedTeacher = function(test) {
  db.CourseSchedule.find(1).success(function(schedule) {
    var idTeacher = 1;
    db.Semester.find(1).success(function(semester) {
      schedule.assignedTeacher(idTeacher, semester, function() {

        schedule.getSemesterTeachers().success(function(semesterTeachers) {

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

exports.testDeallocateTeacher = function(test) {
  var idSchedule = 1;
  var idTeacher = 1;
  db.CourseSchedule.deallocateTeacher(idSchedule, idTeacher, function() {
    db.CourseSchedule.find(idSchedule).success(function(schedule) {
      schedule.getSemesterTeachers().success(function(semesterTeachers) {
        test.equal(semesterTeachers.length, 0, "SemesterTeacher length should be " + 0);
        test.done();

      });
    });
  });
}

exports.testDeallocate = function(test) {
  var idSchedule = 7;
  db.CourseSchedule.deallocate(idSchedule, function() {
    db.CourseSchedule.find(idSchedule).success(function(schedule) {
      test.equal(schedule.hour, -1, "schedule.hour should be " + -1);
      test.done();
    });
  });
}

exports.testScheduleToSave = function(test) {
  var schedule = {
    type: 'Teorica',
    day: 1,
    hour: 14,
    minutes: 0,
    durationHour: 3,
    durationMinutes: 0
  };
  scheduleToSave = db.CourseSchedule.scheduleToSave(schedule);
  test.equal(scheduleToSave.type, schedule.type, "scheduleToSave.type  should be schedule.type");
  test.equal(scheduleToSave.day, schedule.day, "scheduleToSave.day  should be schedule.day");
  test.equal(scheduleToSave.hour, schedule.hour, "scheduleToSave.hour  should be schedule.hour");
  test.equal(scheduleToSave.minutes, schedule.minutes, "scheduleToSave.minutes  should be schedule.minutes");
  test.equal(scheduleToSave.durationHour, schedule.durationHour, "scheduleToSave.durationHour  should be schedule.durationHour");
  test.equal(scheduleToSave.durationMinutes, schedule.durationMinutes, "scheduleToSave.durationMinutes  should be schedule.durationMinutes");
  test.done();
}