var db = require('./');
var sequelize = db.sequelize;


exports.testCheckClassroomUsedOk = function(test) {
  idClassRoom = 1;
  year = 2014;
  semester = 1;
  idCourseSchedule = 1;
  db.CourseSchedule.find({
    where: {
      'id': idCourseSchedule
    },
    include: [{
      model: db.PatchSchedule,
      as: 'Patch',
      require: false
    }]
  }).success(function(schedule) {
    db.ClassRoom.checkClassroomUsed(idClassRoom, schedule, year, semester, function(msj) {

      test.equal(msj, undefined, "msj  should be undefined");
      test.done();
    });
  });
}