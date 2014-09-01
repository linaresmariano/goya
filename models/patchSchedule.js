
module.exports = function(sequelize, DataTypes) {

  var PatchSchedule = sequelize.define('PatchSchedule', {
		visibility: DataTypes.BOOLEAN,
		extraHour: {type:DataTypes.INTEGER ,  validate: {min:-1,max:22}},
		extraMinutes: DataTypes.INTEGER,
		extraDurationHour: {type:DataTypes.INTEGER },
		extraDurationMinutes: {type:DataTypes.INTEGER }
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
