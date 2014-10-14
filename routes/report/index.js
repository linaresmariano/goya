var db = require('../../models')


exports.offer = function(req, res) {

  var semester = req.params.semester;
  var year = req.params.year;

  // buscar los del "semester"
  db.Semester.find({
    where: {
      'year': year,
      'semester': semester
    },
  
    include: [ {  model: db.Course, as: 'Courses' ,require:false,
            include: [  {model: db.CourseSchedule, as: 'schedules',require:false,
                    include: [  {model: db.SemesterClassRoom, as: 'SemesterClassRoom',require:false,
								include: [  {model: db.ClassRoom, as: 'ClassRoom',require:false}]},
                          {model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
								include: [  {model: db.Teacher, as: 'Teacher',require:false}]}]},
                  {model: db.Subject, as: 'Subject',require:false},
                  {model: db.SemesterTeacher, as: 'SemesterInstructors',require:false,
						include: [  {model: db.Teacher, as: 'Teacher',require:false}]},
                  {model: db.SemesterTeacher, as: 'SemesterTeachers',require:false,
						include: [  {model: db.Teacher, as: 'Teacher',require:false}]}]
            },
        { model: db.SemesterTeacher, as: 'SemesterTeachers' ,require:false},
        { model: db.SemesterClassRoom, as: 'SemesterClassRooms' ,require:false }]
  })
  .success(function(semester) {
    res.render('report/offer', {
      title: 'Oferta académica',
      semester: semester 
    })
  })

}
