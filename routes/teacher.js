var db = require('../models')


exports.new = function(req, res) {

  res.render('teacher/new', {
    title: 'Crear un profesor'
  })
}


exports.edit = function(req, res) {

  var id = req.params.id;

  db.Teacher.find(id).success(function(teacher) {

    res.render('teacher/new', {
      title: 'Editar un profesor',
      teacher: teacher
    })

  })

}


exports.create = function(req, res) {

  var code = req.body.code;
  var name = req.body.name;
  var year = req.body.year;
  var semester = req.body.semester;

  //Agragando un profesor al ultimo semestre

  db.Teacher.create({
    code: code,
    name: name
  }).success(function(teacher) {
    req.flash(typeMessage.SUCCESS, 'Profesor creado correctamente');
    res.render('teacher/new', {
      title: 'Crear Profesor',
    })
  }).error(function(err) {
    showErrors(req, err);
    res.render('teacher/new', {
      title: 'Crear un profesor',
      teacher: req.body
    })

  })

}


exports.update = function(req, res) {

  var id = req.params.id,
    code = req.body.code,
    name = req.body.name,
    year = req.body.year,
    semester = req.body.semester
  listTeachers = 'teacher/list/' + year + '/' + semester

  db.Teacher.find(id).success(function(teacher) {
    if (teacher) { // if the record exists in the db
      teacher.updateAttributes({
        code: code,
        name: name
      }).success(function(teacherUpdated) {

        res.redirect(listTeachers)
        req.flash(typeMessage.SUCCESS, "El profesor se ha guardado correctamente")

      })
    }
  }).error(function(err) {

    res.redirect(listTeachers)
    req.flash(typeMessage.ERROR, err.name[0])

  })

}


exports.list = function(req, res) {

  var year = req.params.year;
  var semester = req.params.semester;

  db.Teacher.findAll().success(function(teachers) {

    res.render('teacher/list', {
      title: 'Profesores',
      teachers: teachers
    });
  });
};


exports.remove = function(req, res) {

  var idTeacher = req.body.idTeacher;

  db.Teacher.find(idTeacher).on('success', function(teacher) {
    teacher.destroy().on('success', function(u) {
      res.send('ok');
    })
  })

};