module.exports = function(sequelize, DataTypes) {

  var CourseSchedule = sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
    day: {type:DataTypes.INTEGER , validate: {min:-1,max:6}},
    hour: {type:DataTypes.INTEGER , validate: {min:-1,max:22}},
    minutes: DataTypes.INTEGER,
    durationHour: {type:DataTypes.INTEGER},
    durationMinutes: {type:DataTypes.INTEGER}
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.SemesterTeacher, {as: 'SemesterTeachers', through: 'schedule_has_teachers'});
        this.hasMany(models.Course, {as: 'Courses', through: 'schedule_has_courses'});
        this.belongsTo(models.SemesterClassRoom, {as: 'SemesterClassRoom'});
        this.belongsTo(models.PatchSchedule, {as: 'Patch'});
      },

      deallocate: function(id, succes) {
        this.find(id).success(function(courseSchedule) {
          courseSchedule.updateAttributes({
            hour: -1
          }).success(function() {
            succes();
          })
        })
      },

      deallocateClassRoom:function(idCourseSchedule,succes){
        this.find(idCourseSchedule).success(function(courseSchedule) {
          courseSchedule.setSemesterClassRoom(undefined);
          succes();
        })
      }
    },

    instanceMethods: {
      assignedTeacher: function(idTeacher,semester,success){
        //import models
        var SemesterTeacher = CourseSchedule.models.SemesterTeacher;
        //para no perder la referencia en los callbacks
        var schedule = this;
        //obteniendo el SemesterTeacher  del semestre dado	
        SemesterTeacher.getSemesterTeacherFor(idTeacher,semester)
        .success(function(semesterTeacher) {
          schedule.checkAndAssignTeacher(semesterTeacher,idTeacher,semester,success);
        });
      },

      checkAndAssignTeacher: function(semesterTeacher,idTeacher,semester,success) {
        var Teacher=CourseSchedule.models.Teacher;

        //para no perder la referencia en los callbacks
        var schedule=this;

        //Si no existe el semesterTeacher lo crea y lo asigna
        if(semesterTeacher == undefined){
          Teacher.newSemesterTeacher(idTeacher, function(newSemesterTeacher) {
            schedule.addSemesterTeacher(newSemesterTeacher);
            semester.addSemesterTeacher(newSemesterTeacher);
            success(undefined);
        	});
        } else {
          //Si el semesterTeacher existe,simplemente lo asigna
          this.addSemesterTeacher(semesterTeacher);	
          success(undefined);
        }
      },

      cloneToCourse: function(course) {
        
        //para no perder la referencia en los callbacks
        var original = this;

        CourseSchedule.create({
          type: original.type,
          day: original.day,
          hour: original.hour,
          minutes: original.minutes,
          durationHour: original.durationHour,
          durationMinutes: original.durationMinutes

        }).success(function(schedule) {

          CourseSchedule.models.PatchSchedule.create({
            extraHour: 0,
            extraDuration: 0

          }).success(function(patchSchedule) {
            schedule.setPatch(patchSchedule)
            course.addSchedule(schedule)
          })
        })

      }

    }
  })

  return CourseSchedule;
}
