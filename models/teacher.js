module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
		this.hasOne(models.TeacherRequirements, { as: 'Requirements'});
      }
    }
  })

  return Teacher;
}