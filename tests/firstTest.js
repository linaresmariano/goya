var db = require('./');


//Probando un test
exports.testFirst = function (test) {
				var  sequelize= db.sequelize;
				
				 db.Semester.findAll().success(function(semesters) {
					test.equal(semesters.length,2,"semesters lenght should be " + 2);
					test.done();
				})
}

