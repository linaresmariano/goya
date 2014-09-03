
module.exports = function(sequelize, DataTypes) {

  var PatchSchedule = sequelize.define('PatchSchedule', {
		duration: DataTypes.FLOAT,
		minutes: DataTypes.INTEGER,
		hour: DataTypes.INTEGER,
		visibility: DataTypes.BOOLEAN,
    }, {
      classMethods: {
			associate: function(models) {
				PatchSchedule.hasMany(models.Teacher, { as: 'Teachers'});
			}
		}
	}
  )

  return PatchSchedule;
}
