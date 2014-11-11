app.factory('Course', ['$http','CourseSchedule','SemesterTeacher', function($http,CourseSchedule,SemesterTeacher) {
  function Course(data) {
    if (data) {
      angular.extend(this, data)
    }
	this.schedules=createScheduleModels(this.schedules);
	this.semesterTeachers=createSemesterTeacherModels(this.semesterTeachers);
	this.semesterInstructors=createSemesterTeacherModels(this.semesterInstructors);
  };
  
  function createSemesterTeacherModels(semesterTeachers){
	var semesterTeacherModels=[];
	semesterTeachers.forEach(function(semesterTeacher) {
		semesterTeacherModels.push(new SemesterTeacher(semesterTeacher));
	});
	return semesterTeacherModels;
  }
  
  function createScheduleModels(schedules){
	var scheduleModels=[];
	schedules.forEach(function(schedule) {
		scheduleModels.push(new CourseSchedule(schedule));
	});
	return scheduleModels;
  }

  Course.prototype = {
	unifyReferencesCourses:function(courses){
		this.schedules.forEach(function(schedule) {
			schedule.unifyReferencesCourses(courses);
	    });
	},
	
	getAssignedAndNotAssignedSchedules:function(){
		var result={assigned:[],noAssigned:[]};
	    this.schedules.forEach(function(schedule) {
			if(schedule.day != -1  && schedule.hour != -1 ){
				result.assigned.push(new CourseSchedule(schedule));
			}else{
				result.noAssigned.push(new CourseSchedule(schedule));
			}
	    });
		return result;
	},
	
	isTeacher:function(semesterTeacher){
		return semesterTeacher.existSemesterTeacher(this.semesterTeachers) || semesterTeacher.existSemesterTeacher(this.semesterInstructors);
	},
	
	deallocateInstructor:function(idTeacher){
		for(k=0;k<this.semesterInstructors.length;k++){
			if(this.semesterInstructors[k].teacher.id ==idTeacher){
				this.semesterInstructors.splice(k,1);
			}
		}
	},
	
	deallocateTeacher:function(idTeacher){
		for(k=0;k<this.semesterTeachers.length;k++){
			if(this.semesterTeachers[k].teacher.id ==idTeacher){
				this.semesterTeachers.splice(k,1);
			}
		}
	}
  };
   
  return Course;
}]);