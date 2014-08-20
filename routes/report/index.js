var db = require('../../models')


exports.offer = function(req, res) {

  var semester = req.params.semester;
  var year = req.params.year;

  // buscar los del "semester"
  db.Semester.find({
    where: {
      'year': semester ,
      'semester':year
    },
    include: [ {  model: db.Course, as: 'Courses' ,require:false,
      include: [  {model: db.CourseSchedule, as: 'Schedules',require:false,
        include: [  {model: db.ClassRoom, as: 'ClassRoom',require:false}]}]
    }]

  }).success(function(semester) {
    res.render('report/offer', {
      title: 'Oferta académica',
      semester: semester 
    })
    
  })

}
