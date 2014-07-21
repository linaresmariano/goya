module.exports = function(sequelize, DataTypes) {

  return sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
  	day: DataTypes.INTEGER,
	commission: DataTypes.INTEGER,
  	hour: DataTypes.INTEGER,
  	minutes: DataTypes.INTEGER,
  	duration: DataTypes.INTEGER
	},{
      classMethods: {
        associate: function(models) {
          this.hasMany(models.Teacher, { as: 'Teachers'});
		  this.hasOne(models.ClassRoom, { as: 'ClassRoom'});
        }
      }
  })

}