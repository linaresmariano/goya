var db = require('./');
var  sequelize= db.sequelize;


exports.testGetSemester = function (test) {
    var year=2014;
    var semesterNumber=1;
    db.Semester.getSemester(year,semester).success(function(semester){
        test.equal(semester.year,year,"semester.year  should be "+ year);
        test.equal(semester.semester,semesterNumber,"semester.semester  should be "+ semesterNumber);
        test.done();
    });
}

exports.testFindByYearAndSemesterIncludingAll = function (test) {
    var year=2014;
    var semesterNumber=1;
    db.Semester.findByYearAndSemesterIncludingAll(year,semester).success(function(semester){
        test.equal(semester.year,year,"semester.year  should be "+ year);
        test.equal(semester.semester,semesterNumber,"semester.semester  should be "+ semesterNumber);
		test.equal(semester.courses.length,4,"courses length  should be "+ 4);
        test.done();
    });
}


