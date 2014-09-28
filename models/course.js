
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    enrolled: DataTypes.INTEGER,
    commission: {type:DataTypes.INTEGER ,  validate: {min:0}},
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
    modality: DataTypes.INTEGER,
    nick: DataTypes.STRING,
    color: DataTypes.STRING
    }, {
      classMethods: {
        associate: function(models) {
			Course.hasMany(models.CourseSchedule, { as: 'Schedules',through:'schedule_has_courses'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterTeachers',through:'course_has_teachers'});
			Course.hasMany(models.SemesterTeacher,{ as: 'SemesterInstructors', through: 'course_has_instructors'});
			Course.hasOne(models.CourseRequirements, { as: 'Requirements'});
			Course.belongsTo(models.Subject, { as: 'Subject'});
        },
		findWithTeachers:function(idCourse){
			var Teacher=Course.models.Teacher;
			var SemesterTeacher=Course.models.SemesterTeacher;
			return this.find({
									where:{id:idCourse},
									include: [ {model: SemesterTeacher, as: 'SemesterTeachers',require:false,
												include: [ 	{model: Teacher, as: 'Teacher',require:false}]},
											   {model: SemesterTeacher, as: 'SemesterInstructors',require:false,
												include: [ 	{model: Teacher, as: 'Teacher',require:false}]}]
			});
		},
		deallocateTeacher:function(idCourse,idTeacher,success){
			this.findWithTeachers(idCourse).success(function(course){
				course.deallocateATypeOfTeacher(idTeacher,course.semesterTeachers,function(teacher){
					course.removeSemesterTeacher(teacher);
				});
				success();
			});
		},
		deallocateInstructor:function(idCourse,idTeacher,success){
			this.findWithTeachers(idCourse).success(function(course){
				course.deallocateATypeOfTeacher(idTeacher,course.semesterInstructors,function(teacher){
					course.removeSemesterInstructor(teacher);
				});
				success();
			});
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
		assignedInstructor:function(idTeacher,semester,success){
			//import models
			var SemesterTeacher=Course.models.SemesterTeacher;
			//para no perder la referencia en los callbacks
			var course=this;
			//obteniendo el SemesterTeacher  del semestre dado	
			SemesterTeacher.getSemesterTeacherFor(idTeacher,semester)
			.success(function(semesterTeacher){
				course.checkAndAssignInstructor(semesterTeacher,idTeacher,semester,success);
			});
		},
		deallocateATypeOfTeacher:function(idTeacher,semesterTeachers,dellocateTeacher){
			for(n=0;n < semesterTeachers.length;n++){	
				if(semesterTeachers[n].teacher.id == idTeacher){
					dellocateTeacher(semesterTeachers[n]);
					break;
				}
			}
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
		},
		checkAndAssignInstructor:function(semesterTeacher,idTeacher,semester,success) {
				var Teacher=Course.models.Teacher;
				
				//para no perder la referencia en los callbacks
				var course=this;
				
				//Si no existe el semesterTeacher lo crea y lo asigna
				if(semesterTeacher == undefined){
					Teacher.newSemesterTeacher(idTeacher,function(newSemesterTeacher) {
											course.addSemesterInstructor(newSemesterTeacher);	
											semester.addSemesterTeacher(newSemesterTeacher);
											success(undefined);											
									});
				}else{
					//Si el semesterTeacher existe,simplemente lo asigna
					this.addSemesterInstructor(semesterTeacher);	
					success(undefined);
				}
		}
	  }
    }
  )

  return Course
}
