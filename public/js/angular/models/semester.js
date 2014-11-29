app.factory('Semester', ['$http', 'Course', 'Teacher', 'ClassRoom', function($http, Course, Teacher, ClassRoom) {
  function Semester(data) {
    if (data) {
      angular.extend(this, data);
    }
    var coursesModels = [];
    if (!this.courses) return;
    //Creando los modelos de los cursos
    this.courses.forEach(function(course) {
      coursesModels.push(new Course(course));
    });

    //Diferenciando los horarios asignados de los que no fueron asignados
    for (i = 0; i < coursesModels.length; i++) {
      this.assignedSchedules = this.assignedSchedules.concat(coursesModels[i].getAssignedAndNotAssignedSchedules().assigned);
      this.schedulesAreNotAssigned = this.schedulesAreNotAssigned.concat(coursesModels[i].getAssignedAndNotAssignedSchedules().noAssigned);
    }

    //Eliminando schedules duplicados traidos del server
    removeDuplicate(this.assignedSchedules);
    removeDuplicate(this.schedulesAreNotAssigned);

    //Unificando las referencia a los cursos
    coursesModels.forEach(function(course) {
      course.unifyReferencesCourses(coursesModels);
      course.schedules = [];
    });

    //Creando los modelos de los teachers
    this.teachers = createTeacherModels(this.teachers);

    this.classRooms = createClassRoomModels(this.classRooms);

  };

  function createTeacherModels(teachers) {
    var teacherModels = [];
    teachers.forEach(function(teacher) {
      teacherModels.push(new Teacher(teacher));
    });
    return teacherModels;
  }

  function createClassRoomModels(classRooms) {
    var classRoomModels = [];
    classRooms.forEach(function(classRoom) {
      classRoomModels.push(new ClassRoom(classRoom));
    });
    return classRoomModels;
  }

  function removeDuplicate(schedules) {
    for (j = 0; j < schedules.length; j++) {
      if (ocurrenceOf(schedules[j], schedules) > 1) {
        schedules.splice(j, 1);
      }
    }
  }

  function ocurrenceOf(schedule, schedules) {
    allSchedules = schedules;
    cant = 0;
    for (o = 0; o < allSchedules.length; o++) {
      if (allSchedules[o].id == schedule.id) {
        cant++;
      }
    }
    return cant;
  }

  Semester.prototype = {
    getDescription: function() {
      return 'Semestre ' + this.semester + ' del año ' + this.year;
    },

    unifySchedules: function(schedules) {
      firstSchedule = schedules[0];
      for (p = 1; p < schedules.length; p++) {
        for (j = 0; j < schedules[j].courses.length; j++) {
          firstSchedule.courses.push(schedules[p].courses[j]);
        }
      }
      return firstSchedule;
    },

    getTeacherOfList: function(teacher) {
      var teacherOfList;
      this.teachers.forEach(function(t) {
        if (t.id == teacher.id) {
          teacherOfList = t;
        }
      })
      return teacherOfList;
    },

    isAssignedInstructor: function(teacher) {
      var result = false;
      this.assignedSchedules.forEach(function(schedule) {
        schedule.courses.forEach(function(course) {
          course.semesterInstructors.forEach(function(st) {
            if (st.teacher.id == teacher.id) {
              result = true;
              return;
            }
          });
        });
      })
      return result;
    },

    isAssignedTeacher: function(teacher) {
      var result = false;
      this.assignedSchedules.forEach(function(schedule) {
        schedule.courses.forEach(function(course) {
          course.semesterTeachers.forEach(function(st) {
            if (st.teacher.id == teacher.id) {
              result = true;
              return;
            }
          });
        });
      })
      return result;
    },

    getSchedulesAtTheSameTime: function(day, hour, minutes, schedule) {
      schedules = [];
      for (h = 0; h < this.assignedSchedules.length; h++) {
        assignedSchedule = this.assignedSchedules[h];
        if (assignedSchedule.day == day && assignedSchedule.hour == hour &&
          assignedSchedule.minutes == minutes && assignedSchedule.durationHour == schedule.durationHour &&
          assignedSchedule.durationMinutes == schedule.durationMinutes &&
          assignedSchedule.courses[0].subject.name == schedule.courses[0].subject.name && assignedSchedule.durationMinutes == schedule.durationMinutes &&
          assignedSchedule.patch.extraHour == schedule.patch.extraHour && assignedSchedule.patch.extraDuration == schedule.patch.extraDuration &&
          assignedSchedule.type == schedule.type &&
          assignedSchedule.courses[0].id != schedule.courses[0].id &&
          assignedSchedule.courses[0].color == schedule.courses[0].color &&
          schedule.id != assignedSchedule.id) schedules.push(assignedSchedule);
      }
      return schedules;
    },

    removeSchedule: function(schedule) {
      index = this.assignedSchedules.indexOf(schedule);
      if (index != -1)
        this.assignedSchedules.splice(index, 1);
      this.schedulesAreNotAssigned.push(schedule);
    },

    addSchedule: function(schedule) {
      index = this.schedulesAreNotAssigned.indexOf(schedule);
      if (index != -1)
        this.schedulesAreNotAssigned.splice(index, 1);
      this.assignedSchedules.push(schedule);
    },

    getDescription: function() {
      return 'Semestre ' + this.semester + ' del año ' + this.year;
    }
  };

  return Semester;
}]);