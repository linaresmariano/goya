
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    enrolled: DataTypes.INTEGER,
    commission: {type:DataTypes.INTEGER ,  validate: {min:0}},
    color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
			Course.hasMany(models.CourseSchedule, { as: 'Schedules'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterTeachers',through:'course_has_teachers'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterInstructors', through: 'course_has_instructors'});
			Course.hasOne(models.CourseRequirements, { as: 'Requirements'});
			Course.belongsTo(models.Subject, { as: 'Subject'});
        }
      },
	  instanceMethods:{
		assignedTeacher:function(idTeacher,semester,success){
			//import models
			var SemesterTeacher=Course.models.SemesterTeacher;
			//para no perder la referencia en los callbacks
			var course=this;
			//obteniendo el SemesterTeacher  del semestre dado	
			SemesterTeacher.getSemesterTeacherFor(idTeacher,semester)
			.success(function(semesterTeacher){
				course.checkAndAssignTeacher(semesterTeacher,idTeacher,semester,success);
			});
		},
		checkAndAssignTeacher:function(semesterTeacher,idTeacher,semester,success) {
				var Teacher=Course.models.Teacher;
				
				//para no perder la referencia en los callbacks
				var course=this;
				
				//Si no existe el semesterTeacher lo crea y lo asigna
				if(semesterTeacher == undefined){
					Teacher.newSemesterTeacher(idTeacher,function(newSemesterTeacher) {
											course.addSemesterTeacher(newSemesterTeacher);	
											semester.addSemesterTeacher(newSemesterTeacher);
											success(undefined);											
									});
				}else{
					//Si el semesterTeacher existe,simplemente lo asigna
					this.addSemesterTeacher(semesterTeacher);	
					success(undefined);
				}
		}
	  }
    }
  )

  return Course
}
