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
            include: [  {model: db.CourseSchedule, as: 'Schedules',require:false,
                    include: [  {model: db.ClassRoom, as: 'ClassRoom',require:false},
                          {model: db.Teacher, as: 'Teachers',require:false}]},
                  {model: db.Subject, as: 'Subject',require:false},
                  {model: db.Teacher, as: 'CourseInstructor',require:false},
                  {model: db.Teacher, as: 'CourseTeacher',require:false}]
            },
        { model: db.Teacher, as: 'Teachers' ,require:false},
        { model: db.ClassRoom, as: 'ClassRooms' ,require:false }]
  })
  .success(function(semester) {
    res.render('report/offer', {
      title: 'Oferta académica',
      semester: semester 
    })
  })

}
