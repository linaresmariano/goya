module.exports = function(sequelize, DataTypes) {

  var SemesterTeacher = sequelize.define('SemesterTeacher', {
  
  }, {
    classMethods: {
      associate: function(models) {
		this.hasMany(models.CourseSchedule, { through:'schedule_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_teachers'});
		this.hasMany(models.Course,{through:'course_has_instructors'});
		this.hasOne(models.TeacherRequirements, { as: 'Requirements'});
		this.belongsTo(models.Teacher, { as: 'Teacher'});
		this.belongsTo(models.Semester,{ as: 'Semester'});
      },
		getSemesterTeacherFor:function(idTeacher,semester){
			var Teacher=SemesterTeacher.models.Teacher;
			var Semester=SemesterTeacher.models.Semester;
			
			return SemesterTeacher.find({
			where: {'Teacher.id':idTeacher,'Semester.year':semester.year,'Semester.semester':semester.semester},
			include: [ {	model: Teacher, as: 'Teacher' ,require:false },
					{	model: Semester, as: 'Semester' ,require:false }]
			});
		
		}
	
	}
  })

  return SemesterTeacher;
}