
module.exports = function(sequelize, DataTypes) {

  var PatchSchedule = sequelize.define('PatchSchedule', {
		visibility: DataTypes.BOOLEAN,
		day: {type:DataTypes.INTEGER ,  validate: {min:-1,max:6}},
		hour: {type:DataTypes.INTEGER ,  validate: {min:-1,max:22}},
		minutes: DataTypes.INTEGER,
		duration: {type:DataTypes.INTEGER }
    }, {
      classMethods: {
			associate: function(models) {
				PatchSchedule.hasMany(models.Teacher, { as: 'Teachers'});
				PatchSchedule.hasOne(models.CourseSchedule, { as: 'CourseSchedule'});
			}
		}
	}
  )

  return PatchSchedule;
}
