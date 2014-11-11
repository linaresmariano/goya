app.factory('SemesterTeacher', ['$http','Teacher', function($http,Teacher) {
  function SemesterTeacher(data) {
    if (data) {
      angular.extend(this, data)
    }
	this.teacher=new Teacher(this.teacher);
  };

  SemesterTeacher.prototype = {
	existSemesterTeacher:function(semesterTeachers){
		for(u=0;u < semesterTeachers.length;u++){
			if(semesterTeachers[u].teacher.id == this.teacher.id ){
				return true;
			}
		}
		return false;
	},
	
	existSemesterTeacherInSchedulesOfCourses:function(courses,events){
		for(rrr=0;rrr<events.length;rrr++){
			if(events[rrr].schedule.existSemesterTeacherInSchedules(courses,this)) return true;
		}
		return false;
	},
	
	isTeacherOfCourses:function(courses){
		for(n=0;n < courses.length;n++){
			if(courses[n].isTeacher(this) ){
				return true;
			}
		}
		return false;
	},
	existTeacher:function(semesterTeachers){
		for(n=0;n < semesterTeachers.length;n++){
			if(semesterTeachers[n].id == this.id ){
				return true;
			}
		}
		return false;
	}
  };
  return SemesterTeacher;
}]);