module.exports = function(sequelize, DataTypes) {

  var ClassRoom= sequelize.define('ClassRoom', {
	name:{type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 100],
            msg: 'El nombre del aula debe contener entre 4 y 100 caracteres'
        },
        notEmpty:true,
		notNull:true
      }
    },
	number: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [1, 25],
            msg: 'La numero del  aula debe tenes entre 1 y 25 caracteres'
        },
        notEmpty:true,
		notNull:true
      }
    },
	description: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 200],
            msg: 'La descripcion del  aula debe tenes entre 4 y 200 caracteres'
        },
         notEmpty:true,
		notNull:true
      }
    },
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
	numberOfComputers: {type:DataTypes.INTEGER ,  validate: {min:0}},
	hasProyector: DataTypes.BOOLEAN
  },{	
  deletedAt: 'destroyTime',
  paranoid: true,
  classMethods: {
			associate: function(models) {
			  this.hasMany(models.SemesterClassRoom, { as: 'SemesterClassRoom'});
			},
			
			checkClassroomUsed: function(idClassRoom,schedule,year,semester,success) {
			  	var CourseSchedule=ClassRoom.models.CourseSchedule;
				var Semester=ClassRoom.models.Semester;
				var SemesterClassRoom=ClassRoom.models.SemesterClassRoom;
				var PatchSchedule=ClassRoom.models.PatchSchedule;
				
				sequelize.query("SELECT * FROM "+ClassRoom.tableName
								+" JOIN "+SemesterClassRoom.tableName
										+" ON "+SemesterClassRoom.tableName+".ClassRoomId = "
										+ClassRoom.tableName+".id "
								+" JOIN "+CourseSchedule.tableName
										+" ON "+CourseSchedule.tableName+".SemesterClassRoomId = "
										+SemesterClassRoom.tableName+".id "
								+" JOIN "+Semester.tableName
										+" ON "+Semester.tableName+".id = "
										+SemesterClassRoom.tableName+".semesterId "
								+" JOIN "+PatchSchedule.tableName
										+" ON "+PatchSchedule.tableName+".id = "
										+CourseSchedule.tableName+".PatchScheduleId "
								+" WHERE "+ClassRoom.tableName+".id = "+idClassRoom
										+" AND "+Semester.tableName+".year = "+year
										+" AND "+Semester.tableName+".semester = "+semester
										+" AND ((("+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes"
                                        +"+"+PatchSchedule.tableName+".extraHour * 60 <= "
											+(schedule.hour*60+schedule.minutes+schedule.patch.extraHour*60 )
										+" AND "+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes +"
											+CourseSchedule.tableName+".durationHour *60 + "+CourseSchedule.tableName+".durationMinutes-1 "
                                            +"+"+PatchSchedule.tableName+".extraHour * 60+"+PatchSchedule.tableName+".extraDuration * 60 >= "
											+(schedule.hour*60+schedule.minutes+schedule.patch.extraHour*60 )
										+") OR ("+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes"
											+"+"+PatchSchedule.tableName+".extraHour * 60 <= "
											+(schedule.durationHour*60+schedule.durationMinutes+schedule.hour*60+schedule.minutes-1
												+schedule.patch.extraHour*60+schedule.patch.extraDuration*60)
										+" AND "+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes +"
											+CourseSchedule.tableName+".durationHour*60 + "+CourseSchedule.tableName+".durationMinutes-1 "
                                            +"+"+PatchSchedule.tableName+".extraHour * 60+"+PatchSchedule.tableName+".extraDuration * 60 >= "
											+(schedule.durationHour*60+schedule.durationMinutes+schedule.hour*60+schedule.minutes-1
											    +schedule.patch.extraHour*60+schedule.patch.extraDuration*60)
										+"))"
										+"OR (("+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes"
                                        +"+"+PatchSchedule.tableName+".extraHour * 60 > "
											+(schedule.hour*60+schedule.minutes+schedule.patch.extraHour*60 )
										+") AND ("+CourseSchedule.tableName+".hour*60 + "+CourseSchedule.tableName+".minutes"
											+"+"+PatchSchedule.tableName+".extraHour * 60 < "
											+(schedule.durationHour*60+schedule.durationMinutes+schedule.hour*60+schedule.minutes-1
												+schedule.patch.extraHour*60+schedule.patch.extraDuration*60)
										+"))) AND "+CourseSchedule.tableName+".day = "+schedule.day
										+" AND "+CourseSchedule.tableName+".id != "+schedule.id ).success(function(myTableRows) {
								
				    if(myTableRows.length > 0){
						console.log(myTableRows);
						console.log(schedule);
						success({error:'El aulas esta siendo usada en ese horario!'});
					}else{
						success();
					}
					
				}).error(function(err) {
					console.log(err);
				})

			}
		}
    })
	return ClassRoom;
}