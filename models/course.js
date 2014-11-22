
module.exports = function(sequelize, DataTypes) {

  var Course = sequelize.define('Course', {
    enrolled: {type:DataTypes.INTEGER ,  validate: {min:0}},
    commission: {type:DataTypes.INTEGER ,  validate: {min:0}},
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
    modality: DataTypes.INTEGER,
    nick: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [2, 20],
            msg: 'El nick del curso debe contener entre 2 y 20 caracteres'
        },
        notEmpty:true,
		notNull:true
      }
    },
    color: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Course.hasMany(models.CourseSchedule, { as: 'schedules',through:'schedule_has_courses'});
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
					course.removeSemesterTeacher(teacher).success(function(){
					    success();
					});
				});
			});
		},
		deallocateInstructor:function(idCourse,idTeacher,success){
			this.findWithTeachers(idCourse).success(function(course){
				course.deallocateATypeOfTeacher(idTeacher,course.semesterInstructors,function(teacher){
					course.removeSemesterInstructor(teacher).success(function(){
					    success();
					});
				});
			});
		}
		
		},

    instanceMethods: {

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
											course.addSemesterTeacher(newSemesterTeacher).success(
												function(result){
													semester.addSemesterTeacher(newSemesterTeacher).success(function(){
														success();
													})
												}
											)										
									});
				}else{
					//Si el semesterTeacher existe,simplemente lo asigna
					this.addSemesterTeacher(semesterTeacher).success(
												function(result){
													success(undefined);	
												}
											)
				}
		},

      checkAndAssignInstructor: function(semesterTeacher, idTeacher, semester, success) {
        var Teacher = Course.models.Teacher;

        //para no perder la referencia en los callbacks
        var course = this;

        //Si no existe el semesterTeacher lo crea y lo asigna
        if(semesterTeacher == undefined){
        	Teacher.newSemesterTeacher(idTeacher, function(newSemesterTeacher) {
	
            course.addSemesterInstructor(newSemesterTeacher).success(
              function(result){
				semester.addSemesterTeacher(newSemesterTeacher).success(function(){
					success();	
				})
              }
            )

          });
        }else{
          //Si el semesterTeacher existe,simplemente lo asigna
          this.addSemesterInstructor(semesterTeacher).success(
            function(result){
              success(undefined);	
            }
          )
        }
      },

      cloneToSemester: function(semester) {

        //para no perder la referencia en los callbacks
        var original = this;

        Course.create({
          SubjectId: original.SubjectId,
          SemesterId: semester.id,
          enrolled: original.enrolled,
          nick: original.nick,
          modality: original.modality,
          capacity: original.capacity,
          commission: original.commission,
          color: original.color
        }).success(function(course) {

          semester.addCourse(course)

          if(original.semesterTeachers) {
            original.semesterTeachers.forEach(function(semesterTeacher) {
              course.assignedTeacher(semesterTeacher.teacher.id, semester, function(x){})
            })
          }

          if(original.semesterInstructors) {
            original.semesterInstructors.forEach(function(semesterTeacher) {
              course.assignedInstructor(semesterTeacher.teacher.id, semester, function(x){})
            })
          }

          if(original.schedules) {
            original.schedules.forEach(function(schedule) {
              schedule.cloneToCourse(course, semester)
            })
          }

        })
      }

    }
  })

  return Course
}
