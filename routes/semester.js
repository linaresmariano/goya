var db = require('../models')


exports.new = function(req, res) {

  db.Semester.findAll({
    order: 'year DESC, semester DESC'
  }).success(function(semesters) {

    res.render('semester/new', {
      title: 'Crear un semester',
      semesters: semesters
    })

  })

}

exports.last = function(req, res){
	
  db.Semester.findAll({
		order:' year DESC ,semester DESC',
		limit: 1
	}).success(function(semesters) {
		if(semesters.length > 0){
			res.json({ semester: { year: semesters[0].year , number: semesters[0].semester } });
		}else{
			res.json({});
		}
  })

};


exports.create = function(req, res) {

  var semester = req.body.semester;
  var year = req.body.year;

  db.Semester.getSemester(year, semester).success(function(semesters) {
	
    if(!semesters) {

      db.Semester.create({
        year: year,
        semester: semester
      }).success(function(semester) {

        var idClon = req.body.idSemesterToClone

        if(idClon) {

          db.Semester.cloneFromTo(idClon, semester).success(function(semesterCloned) {

            res.redirect('/')
            req.flash(typeMessage.SUCCESS, "El semestre se ha guardado correctamente")

          }).error(function(err) {
            showErrors(req, err)
            res.redirect('back')
          })

        } else {

          res.redirect('/')
          req.flash(typeMessage.SUCCESS, "El semestre se ha guardado correctamente")

        }

      }).error(function(err) {
        showErrors(req, err);
        res.redirect('back');
      })

    } else {

      req.flash(typeMessage.ERROR, "El semestre "+semester+" del año "+year+" ya existe")
      res.redirect('back');

    }

  })

}

exports.grid = function(req, res) {

  var year = req.params.year;
  var semester = req.params.semester;

  // buscar los del "semester"
  db.Semester.findByYearAndSemesterIncludingAll(year, semester).success(function(semester) {
	if(check(semester,'El semestre no existe,debe crearlo.',res))return;
  
    db.ClassRoom.findAll().success(function(classRooms) {

      db.Teacher.findAll({       
        include: [{model: db.SemesterTeacher, as: 'SemesterTeachers', require: false,
          include: [
            {model: db.Semester, as: 'Semester', require: false},
            {model: db.Course, as: 'teacherCourses', require: false},
            {model: db.Course, as: 'instructorCourses', require: false}
          ]
        }]

      }).success(function(teachers) {

        res.render('semester/grid', {
          title: 'Grilla',
          semester: {
            courses: semester.courses,
            classRooms: classRooms,
            teachers: teachers,
            year: semester.year,
            semester: semester.semester
          }
        })
      })
    })
  })
}


