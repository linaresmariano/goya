module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.SemesterTeacher, { as: 'SemesterTeachers'});
		this.hasMany(models.PatchSchedule, { through:'patchschedule_has_teachers'});
      },
	  //crea un nuevo SemesterTeacher a partir del teacher de id 'idTeacher'
	  newSemesterTeacher:function(idTeacher,success){
		var SemesterTeacher=Teacher.models.SemesterTeacher;
	  
		Teacher.find(idTeacher).success(function(teacher) {
						SemesterTeacher.create({
						}).success(function(newSemesterTeacher){
							newSemesterTeacher.setTeacher(teacher).success(
								function(result){
									success(newSemesterTeacher);
								}
							);
							
						});

				});
		}
    }
  })

  return Teacher;
}