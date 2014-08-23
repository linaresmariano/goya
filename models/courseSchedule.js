module.exports = function(sequelize, DataTypes) {
  var CourseSchedule=sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
  	day: {type:DataTypes.INTEGER ,  validate: {min:-1,max:6}},
  	hour: {type:DataTypes.INTEGER ,  validate: {min:-1,max:22}},
  	minutes: DataTypes.INTEGER,
  	duration: {type:DataTypes.INTEGER ,  validate: {min:0,max:6}}
	},{
      classMethods: {
        associate: function(models) {
          this.hasMany(models.SemesterTeacher, { as: 'SemesterTeachers',through:'schedule_has_teachers'});
		  this.belongsTo(models.SemesterClassRoom, { as: 'SemesterClassRoom'});
        },
		deallocate:function(id,succes){
				this.find(id).success(function(courseSchedule) {
					courseSchedule.updateAttributes({
							hour: -1
						}).success(function() {
							succes();
						})
				})
		}
      },
	  instanceMethods:{
		assignedTeacher:function(idTeacher,semester,year,succes){
			//import models
			var Teacher=CourseSchedule.models.Teacher;
			var Semester=CourseSchedule.models.Semester;
			var SemesterTeacher=CourseSchedule.models.SemesterTeacher;
		
			//para no perder la referencia en los callbacks
			var schedule=this;
			
			SemesterTeacher.getSemesterTeacherFor(idTeacher,year,semester)
			.success(function(semesterTeacher) {
		
				if(semesterTeacher == undefined){
					Teacher.newSemesterTeacher(idTeacher).success(function(newSemesterTeacher) {
											schedule.addSemesterTeacher(newSemesterTeacher);	
											Semester.getSemester(year,semester).success(function(semester) {
												semester.addSemesterTeacher(newSemesterTeacher);
												succes();
											});
																					
									});
				}else{
					schedule.addSemesterTeacher(semesterTeacher);	
					succes();
				}
			})
		}
	  }
  })
	return CourseSchedule;
}