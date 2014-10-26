module.exports = function(sequelize, DataTypes) {

  var Teacher = sequelize.define('Teacher', {
    code: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [2, 20],
            msg: 'El codigo del profesor debe contener entre 2 y 20 caracteres'
        },
        notEmpty:true
      }
    },
    name: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 100],
            msg: 'El nombre del profesor debe contener entre 4 y 100 caracteres'
        },
        notEmpty:true
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.SemesterTeacher, { as: 'SemesterTeachers'});
		this.hasMany(models.PatchSchedule, { through:'patchschedule_has_teachers'});
      },
	  //crea un nuevo SemesterTeacher a partir del teacher de id 'idTeacher'
	  newSemesterTeacher:function(idTeacher,success){
		var SemesterTeacher=Teacher.models.SemesterTeacher;
	  
		Teacher.find(idTeacher).success(function(teacher) {
						SemesterTeacher.create({
						}).success(function(newSemesterTeacher){
							newSemesterTeacher.setTeacher(teacher).success(
								function(result){
									success(newSemesterTeacher);
								}
							);
							
						});

				});
		}
    }
  })

  return Teacher;
}