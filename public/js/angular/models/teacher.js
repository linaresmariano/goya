app.factory('Teacher', ['$http', function($http) {
  function Teacher(data) {
    if (data) {
      angular.extend(this, data)
    }

  };

  Teacher.prototype = {
	hasCurrentSemesterTeachers:function(year,semester){
        semesterTeachers=[];
        this.semesterTeachers.forEach(function(semesterTeacher) {
            if(semesterTeacher.semester.year == year && semesterTeacher.semester.semester == semester
                && hasCourses(semesterTeacher)){
                semesterTeachers.push(semesterTeacher)
            }
        });
        return semesterTeachers.length == 0 ? false : true;
	},
	
	existTeacher:function(teachers){
		for(n=0;n < teachers.length;n++){
			if(teachers[n].id == this.id ){
				return true;
			}
		}
		return false;
	},
	newSemesterTeacher:function(){
		return {id:this.id,teacher:this};
	}
  };
  return Teacher;
}]);