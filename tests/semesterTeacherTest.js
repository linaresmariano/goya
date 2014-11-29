var db = require('./');
var sequelize = db.sequelize;


exports.testGetSemesterTeacherFor = function(test) {
  year = 2014;
  semester = 1;
  idTeacher = 1;
  db.SemesterTeacher.getSemesterTeacherFor(idTeacher, {
    year: year,
    semester: semester
  }).success(function(semesterTeacher) {
    test.equal(semesterTeacher.id, idTeacher, "semesterTeacher.id  should be " + idTeacher);
    test.equal(semesterTeacher.semester.year, year, "semesterTeacher.semester.year  should be " + year);
    test.equal(semesterTeacher.semester.semester, semester, "semesterTeacher.semester.semester should be " + semester);
    test.done();
  });
}