module.exports = function(sequelize, DataTypes) {

  var CourseSchedule = sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
    day: {
      type: DataTypes.INTEGER,
      validate: {
        min: -1,
        max: 6
      }
    },
    hour: {
      type: DataTypes.INTEGER,
      validate: {
        min: -1,
        max: 22
      }
    },
    minutes: DataTypes.INTEGER,
    durationHour: {
      type: DataTypes.INTEGER
    },
    durationMinutes: {
      type: DataTypes.INTEGER
    }
  }, {
    classMethods: {
      associate: function(models) {
        this.hasMany(models.SemesterTeacher, {
          as: 'SemesterTeachers',
          through: 'schedule_has_teachers'
        });
        this.hasMany(models.Course, {
          as: 'Courses',
          through: 'schedule_has_courses'
        });
        this.belongsTo(models.SemesterClassRoom, {
          as: 'SemesterClassRoom'
        });
        this.belongsTo(models.PatchSchedule, {
          as: 'Patch'
        });
      },

      separateSchedule: function(idSchedule, idCourse, success) {
        this.find({
          where: {
            'id': idSchedule
          },
          include: [{
            model: CourseSchedule.models.PatchSchedule,
            as: 'Patch',
            require: false
          }]
        }).success(function(schedule) {

          CourseSchedule.models.Course.find(idCourse).success(function(course) {
            schedule.removeCourse(course);

            var scheduleToSave = CourseSchedule.scheduleToSave(schedule);

            scheduleToSave.save().success(function(savedSchedule) {
              savedSchedule.addCourse(course);
              CourseSchedule.models.PatchSchedule.clonePatch(schedule.patch).save().success(function(newPatch) {
                savedSchedule.setPatch(newPatch);
                success(savedSchedule.id + '');
              });
            });
          });
        });
      },

      scheduleToSave: function(schedule) {
        return this.build({
          type: schedule.type,
          day: schedule.day,
          hour: schedule.hour,
          minutes: schedule.minutes,
          durationHour: schedule.durationHour,
          durationMinutes: schedule.durationMinutes
        })
      },

      unify: function(schedule, firstSchedule) {
        var scheduleParam = schedule;
        this.find(scheduleParam.id).success(function(schedule) {
          var scheduleFind = schedule;
          schedule.destroy().success(function() {
            CourseSchedule.find(firstSchedule.id).success(function(firstSchedule) {
              for (x = 0; x < scheduleParam.courses.length; x++) {
                addCourse = function(courseParam, firstSchedule) {
                  CourseSchedule.models.Course.find(courseParam.id).success(function(course) {
                    scheduleFind.removeCourse(course);
                    course.removeSchedule(scheduleFind);
                    firstSchedule.addCourse(course);
                  });

                }
                addCourse(scheduleParam.courses[x], firstSchedule);
              }
            });
          })

        })
      },

      newSchedule: function(course, day, hour, durationHour, type) {
        CourseSchedule.create({
          type: type,
          day: day,
          hour: hour,
          minutes: 0,
          durationHour: durationHour,
          durationMinutes: 0
        }).success(function(schedule) {

          CourseSchedule.models.PatchSchedule.create({
            extraHour: 0,
            extraDuration: 0

          }).success(function(patchSchedule) {
            schedule.setPatch(patchSchedule)
            course.addSchedule(schedule)
          })

        })
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

      deallocateClassRoom: function(idCourseSchedule, succes) {
        this.find(idCourseSchedule).success(function(courseSchedule) {
          courseSchedule.setSemesterClassRoom(undefined);
          succes();
        })
      },

      deallocateTeacher: function(idCourseSchedule, idTeacher, success) {
        var SemesterTeacher = this.models.SemesterTeacher;
        var Teacher = this.models.Teacher;
        this.find({
          where: {
            id: idCourseSchedule
          },
          include: [{
            model: SemesterTeacher,
            as: 'SemesterTeachers',
            require: false,
            include: [{
              model: Teacher,
              as: 'Teacher',
              require: false
            }]
          }]
        }).success(function(courseSchedule) {
          for (n = 0; n < courseSchedule.semesterTeachers.length; n++) {
            if (courseSchedule.semesterTeachers[n].teacher.id == idTeacher) {
              courseSchedule.removeSemesterTeacher(courseSchedule.semesterTeachers[n]).success(function() {
                success();
              });

              break;
            }
          }

        })
      },

      assignedClassRoom: function(idClassRoom, idCourseSchedule, year, semester) {
        CourseSchedule.find(idCourseSchedule).success(function(schedule) {

          CourseSchedule.models.SemesterClassRoom.find({
            where: 'ClassRoom.id = ' + idClassRoom + ' AND Semester.year = ' + year + ' AND Semester.semester = ' + semester + ' AND ClassRoom.capacity = SemesterClassRooms.capacity AND  ClassRoom.numberOfComputers = SemesterClassRooms.numberOfComputers ' + ' AND ClassRoom.hasProyector = SemesterClassRooms.hasProyector AND  ClassRoom.numberOfComputers = SemesterClassRooms.numberOfComputers',
            include: [{
              model: CourseSchedule.models.ClassRoom,
              as: 'ClassRoom',
              require: false
            }, {
              model: CourseSchedule.models.Semester,
              as: 'Semester',
              require: false
            }]

          }).success(function(semesterClassRoom) {

            if (semesterClassRoom == undefined) {

              CourseSchedule.models.ClassRoom.find(idClassRoom).success(function(classroom) {
                var newSemesterClassRoom = CourseSchedule.models.SemesterClassRoom.create({
                  name: classroom.name,
                  number: classroom.number,
                  description: classroom.description,
                  capacity: classroom.capacity,
                  numberOfComputers: classroom.numberOfComputers,
                  hasProyector: classroom.hasProyector
                }).success(function(newSemesterClassRoom) {

                  newSemesterClassRoom.setClassRoom(classroom);
                  schedule.setSemesterClassRoom(newSemesterClassRoom);
                  CourseSchedule.models.Semester.find({
                    where: {
                      'year': year,
                      'semester': semester
                    }
                  }).success(function(semester) {
                    semester.addSemesterClassRoom(newSemesterClassRoom);
                  });

                });

              })

            } else {

              schedule.setSemesterClassRoom(semesterClassRoom);

            }

          })

        })
      }
    },

    instanceMethods: {
      assignedTeacher: function(idTeacher, semester, success) {
        //import models
        var SemesterTeacher = CourseSchedule.models.SemesterTeacher;
        //para no perder la referencia en los callbacks
        var schedule = this;
        //obteniendo el SemesterTeacher  del semestre dado	
        SemesterTeacher.getSemesterTeacherFor(idTeacher, semester)
          .success(function(semesterTeacher) {
            schedule.checkAndAssignTeacher(semesterTeacher, idTeacher, semester, success);
          });
      },

      checkAndAssignTeacher: function(semesterTeacher, idTeacher, semester, success) {
        var Teacher = CourseSchedule.models.Teacher;

        //para no perder la referencia en los callbacks
        var schedule = this;

        //Si no existe el semesterTeacher lo crea y lo asigna
        if (semesterTeacher == undefined) {
          Teacher.newSemesterTeacher(idTeacher, function(newSemesterTeacher) {
            schedule.addSemesterTeacher(newSemesterTeacher).success(
              function(result) {
                semester.addSemesterTeacher(newSemesterTeacher);
                success();
              });

          });
        } else {
          //Si el semesterTeacher existe,simplemente lo asigna
          this.addSemesterTeacher(semesterTeacher).success(
            function(result) {
              success();
            });
        }
      },

      cloneToCourse: function(course, semester) {

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

          if (original.semesterClassRoom) {
            CourseSchedule.assignedClassRoom(original.semesterClassRoom.id, schedule.id, semester.year, semester.semester)
          }

          if (original.semesterTeachers) {
            original.semesterTeachers.forEach(function(semesterTeacher) {
              if(!semesterTeacher.teacher.destroyTime)
                schedule.assignedTeacher(semesterTeacher.teacher.id, semester, function(x) {})
            })
          }

          CourseSchedule.models.PatchSchedule.create({
            visibility: original.patch.visibility || true,
            extraHour: original.patch.extraHour || 0,
            extraDuration: original.patch.extraDuration || 0

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