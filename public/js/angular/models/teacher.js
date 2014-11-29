app.factory('Teacher', ['$http', function($http) {
  function Teacher(data) {
    if (data) {
      angular.extend(this, data)
    }

  };

  Teacher.prototype = {
    hasCurrentSemesterTeachers: function(year, semester) {
      semesterTeachers = [];
      for (n = 0; n < this.semesterTeachers.length; n++) {
        if (this.semesterOf(this.semesterTeachers[n], year, semester) && this.isTeacherOrInstructor(this.semesterTeachers[n])) {
          semesterTeachers.push(this.semesterTeachers[n])
        }
      };
      return semesterTeachers.length == 0 ? false : true;
    },

    semesterOf: function(semesterTeacher, year, semester) {
      return semesterTeacher.semester.year == year && semesterTeacher.semester.semester == semester;
    },

    isTeacherOrInstructor: function(semesterTeacher) {
      return semesterTeacher.teacherCourses.length != 0 || semesterTeacher.instructorCourses.length != 0;
    },

    existTeacher: function(teachers) {
      for (n = 0; n < teachers.length; n++) {
        if (teachers[n].id == this.id) {
          return true;
        }
      }
      return false;
    },
    newSemesterTeacher: function() {
      return {
        id: this.id,
        teacher: this
      };
    }
  };
  return Teacher;
}]);