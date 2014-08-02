
module.exports = function(sequelize, DataTypes) {

  var Subject = sequelize.define('Subject', {
    code: DataTypes.STRING,	
    name: DataTypes.STRING,
    },{
      classMethods: {
        associate: function(models) {
			Subject.hasMany(models.Course, { as: 'Courses'});
        }
      }
    }
  )

  return Subject
}
