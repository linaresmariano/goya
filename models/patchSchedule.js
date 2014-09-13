
module.exports = function(sequelize, DataTypes) {

  var PatchSchedule = sequelize.define('PatchSchedule', {
		visibility: DataTypes.BOOLEAN,
		extraHour: {type:DataTypes.FLOAT },
		extraDuration: {type:DataTypes.FLOAT },
    }, {
      classMethods: {
			associate: function(models) {
				PatchSchedule.hasMany(models.Teacher, { as: 'noVisibleTeachers',through:'patchschedule_has_teachers'});
				PatchSchedule.hasOne(models.CourseSchedule, { as: 'CourseSchedule'});
			}
		}
	}
  )

  return PatchSchedule;
}
