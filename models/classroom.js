module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ClassRoom', {
	name: DataTypes.STRING,
	number: DataTypes.STRING,
	description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
	numberOfComputers: DataTypes.INTEGER,
	hasProyector: DataTypes.BOOLEAN
  },{classMethods: {
			associate: function(models) {
			  this.hasMany(models.CourseSchedule, { as: 'CourseSchedule'});
			}
		}
    })
  
}
