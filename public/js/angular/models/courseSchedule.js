app.factory('CourseSchedule', ['$http','SemesterTeacher','Patch', function($http,SemesterTeacher,Patch) {
  function CourseSchedule(data) {
    if (data) {
      angular.extend(this, data)
    }
	this.semesterTeachers=createSemesterTeacherModels(this.semesterTeachers);
	this.patch=new Patch(this.patch);
  };
  
  function createSemesterTeacherModels(semesterTeachers){
	var semesterTeacherModels=[];
	semesterTeachers.forEach(function(semesterTeacher) {
		semesterTeacherModels.push(new SemesterTeacher(semesterTeacher));
	});
	return semesterTeacherModels;
  }


  CourseSchedule.prototype = {
	unifyReferencesCourses:function(courses){
		for(h=0; h<this.courses.length; h++) {
			for(x=0; x< courses.length; x++) {
				if(this.courses[h].id == courses[x].id){
					this.courses[h]=courses[x];
					break;
				}
			}
		}
	},
	
	semesterSemesterTeacher:function(index){
		this.semesterTeachers.splice(index, 1);
	},
	
	getExtraDuration:function(){
		return this.patch.getExtraDuration();
	},
	
	getExtraHour:function(){
		return this.patch.getExtraHour();
	},
	
	clone:function(newCourses,newId){
		schedule=new CourseSchedule(this);
		schedule.courses=[newCourses];
		schedule.id=newId;
		schedule.semesterTeachers=[];
		return schedule;
	},
	
	removeCourseAndReturn:function(index){
		course=this.courses[index];
		this.courses.splice(index,1);
		return course;
	},
	
	existsCourse:function(course){
		for(c=0;c<this.courses.length;c++){
			if(this.courses[c].id == course.id){
				return true;
			}
		}
		return false;
	},
	
	existSemesterTeacherInSchedules:function(courses,teacher){
		for(i=0;i<courses.length;i++){
			if(this.existsCourse(courses[i]) && teacher.existSemesterTeacher(this.semesterTeachers)){
				return true;
			}
		}
		return false;
	},
	
	deallocateInstructorOfCourses:function(idTeacher){
		for(j=0;j<this.courses.length;j++){
			this.courses[j].deallocateInstructor(idTeacher);
		}
	},
	
	deallocateTeacherOfCourses:function(idTeacher){
		for(j=0;j<this.courses.length;j++){
			this.courses[j].deallocateTeacher(idTeacher);
		}
	},
	
	setExtraDuration:function(extraDuration){
		this.patch.setExtraDuration(extraDuration);
	},
	
	setExtraHour:function(extraHour){
		this.patch.setExtraHour(extraHour);
	},
	
	update:function(day,hour,minutes){
		this.day=day;
		this.hour=hour;
		this.minutes=minutes;
	},
	
	updateDuration:function(hour,minutes){
		this.durationHour=hour;
		this.durationMinutes=minutes;
	},
	
	getCommissions:function(){
        commissions='';
        for(r=0;r <this.courses.length;r++){
            commissions+=' - C'+ this.courses[r].commission
        }
        return commissions; 
	},
	
	getTitle:function(){
		return (this.getSubject() ? this.getSubject().nick : ''+ "" )+ this.getCommissions() +"\n" +  this.type
									+'\n Aula '+(this.semesterClassRoom ? this.semesterClassRoom.classRoom.number : '??')
									+ this.getNamesTeachers()
	},
	
	getSubject:function(){
		return this.courses[0].subject;
	},
	
	getNamesTeachers:function(){
		names="";
		var noVisibleTeachers=this.patch.noVisibleTeachers;
		this.semesterTeachers.forEach(function(semesterTeacher) {
			if(!semesterTeacher.teacher.existTeacher(noVisibleTeachers))
				names+= " \n " + semesterTeacher.teacher.code;
		});
		return names;
	},
	
	addSemesterTeacherToCourses:function(teacher){
		for(t=0;t<this.courses.length;t++){
			this.courses[t].semesterTeachers.push(teacher);
		}
	},
	
	addSemesterInstructorToCourses:function(teacher){
		for(z=0;z<this.courses.length;z++){
			this.courses[z].semesterInstructors.push(teacher);
		}
	},
	
	getTeachers:function(){
		teachers=[];
		if(this.courses == undefined)return teachers;
		for(b=0;b < this.courses.length;b++){
			for(c=0;c < this.courses[b].semesterTeachers.length;c++){
				if(!this.courses[b].semesterTeachers[c].existTeacher(teachers)){
					teachers.push(this.courses[b].semesterTeachers[c]);
				}
			}
		}
		return teachers;
	},
	
	getInstructors:function(){
		teachers=[];
		if(this.courses == undefined)return teachers;
		for(b=0;b < this.courses.length;b++){
			for(c=0;c < this.courses[b].semesterInstructors.length;c++){
				if(!this.courses[b].semesterInstructors[c].existTeacher(teachers)){
					teachers.push(this.courses[b].semesterInstructors[c]);
				}
			}
		}
		return teachers;
	},
	
	removeNoVisibleTeacher:function(teacher){
		this.patch.removeNoVisibleTeacher(teacher);
	},
	
	addNoVisibleTeacher:function(teacher){
		this.patch.addNoVisibleTeacher(teacher);
	},
	
	getNoVisibleTeachers:function(){
		return this.patch.noVisibleTeachers;
	},
	
	changeVisibility:function(){
		this.patch.changeVisibility();
	},
	
	getVisibility:function(){
		this.patch.visibility;
	}
  };
  return CourseSchedule;
}]);