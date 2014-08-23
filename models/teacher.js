module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.SemesterTeacher, { as: 'SemesterTeachers'});
      },
	  //crea un nuevo SemesterTeacher a partir del teacher de id 'idTeacher'
	  newSemesterTeacher:function(idTeacher){
	  
		return Teacher.find(idTeacher).success(function(teacher) {
						var newSemesterTeacher= SemesterTeacher.create({
						});
						newSemesterTeacher.setTeacher(teacher);
				});
		}
    }
  })

  return Teacher;
}