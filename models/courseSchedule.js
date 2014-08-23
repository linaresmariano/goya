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
		assignedTeacher:function(idTeacher,semester,success){
			//import models
			var Teacher=CourseSchedule.models.Teacher;
			var SemesterTeacher=CourseSchedule.models.SemesterTeacher;
			//para no perder la referencia en los callbacks
			var schedule=this;
			//obteniendo el SemesterTeacher  del semestre dado	
			SemesterTeacher.getSemesterTeacherFor(idTeacher,semester)
			.success(function(semesterTeacher){
				schedule.checkAndAssignTeacher(semesterTeacher,idTeacher,semester,success);
			});
		},
		checkAndAssignTeacher:function(semesterTeacher,idTeacher,semester,success) {
				var Semester=CourseSchedule.models.Semester;
				
				//para no perder la referencia en los callbacks
				var schedule=this;
				
				//Si no existe el semesterTeacher lo crea y lo asigna
				if(semesterTeacher == undefined){
					Teacher.newSemesterTeacher(idTeacher).success(function(newSemesterTeacher) {
											schedule.addSemesterTeacher(newSemesterTeacher);	
											semester.addSemesterTeacher(newSemesterTeacher);
											success();											
									});
				}else{
					//Si el semesterTeacher existe,simplemente lo asigna
					this.addSemesterTeacher(semesterTeacher);	
					success();
				}
		}
	  }
  })
	return CourseSchedule;
}