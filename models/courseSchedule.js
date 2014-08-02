module.exports = function(sequelize, DataTypes) {

  return sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
  	day: DataTypes.INTEGER,
  	hour: DataTypes.INTEGER,
  	minutes: DataTypes.INTEGER,
  	duration: DataTypes.INTEGER
	},{
      classMethods: {
        associate: function(models) {
          this.hasMany(models.Teacher, { as: 'Teacher'});
		  this.belongsTo(models.ClassRoom, { as: 'ClassRoom'});
        }
      }
  })

}