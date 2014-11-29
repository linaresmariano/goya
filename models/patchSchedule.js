module.exports = function(sequelize, DataTypes) {

  var PatchSchedule = sequelize.define('PatchSchedule', {
    visibility: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    extraHour: {
      type: DataTypes.FLOAT
    },
    extraDuration: {
      type: DataTypes.FLOAT
    },
  }, {
    classMethods: {
      associate: function(models) {
        PatchSchedule.hasMany(models.Teacher, {
          as: 'noVisibleTeachers',
          through: 'patchschedule_has_teachers'
        });
        PatchSchedule.hasOne(models.CourseSchedule, {
          as: 'CourseSchedule'
        });
      },
      clonePatch: function(patch) {
        return PatchSchedule.build({
          visibility: patch.visibility,
          extraHour: patch.extraHour,
          extraDuration: patch.extraDuration,
        })
      }
    }
  })

  return PatchSchedule;
}