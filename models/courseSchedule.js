module.exports = function(sequelize, DataTypes) {

  return sequelize.define('CourseSchedule', {
    type: DataTypes.STRING,
  	day: {type:DataTypes.INTEGER ,  validate: {min:0,max:6}},
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
      }
  })

}