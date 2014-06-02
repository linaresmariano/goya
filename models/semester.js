
module.exports = function(sequelize, DataTypes) {

  var Semester = sequelize.define('Semester', {
    	semester: DataTypes.INTEGER,
    	year: DataTypes.INTEGER
    }, {
      classMethods: {
        associate: function(models) {
          Semester.hasMany(models.Course,{ as: 'Courses'})
        }
      }
    }, {
      instanceMethods: {
        getCode: function() {
          return semester +" "+ year
        }
      }
    }
  )

  return Semester;
}