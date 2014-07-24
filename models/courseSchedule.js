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
          this.hasOne(models.Teacher, { as: 'Teacher'});
		  this.hasOne(models.ClassRoom, { as: 'ClassRoom'});
        }
      },
  })

}