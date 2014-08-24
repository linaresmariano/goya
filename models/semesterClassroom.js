module.exports = function(sequelize, DataTypes) {

  return sequelize.define('SemesterClassRoom', {
	description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
	numberOfComputers: DataTypes.INTEGER,
	hasProyector: DataTypes.BOOLEAN
  },{classMethods: {
			associate: function(models) {
			  this.hasMany(models.CourseSchedule, { as: 'CourseSchedule'});
			  this.belongsTo(models.ClassRoom, { as: 'ClassRoom'});
			  this.hasOne(models.Semester, { as: 'Semester'});
			}
		}
    })
  
}
