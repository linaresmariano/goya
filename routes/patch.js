var db = require('../models')


exports.update = function(req, res) {

  db.PatchSchedule.find({
    where: {
      'id': req.body.idPatch
    }
  }).success(function(patch) {

    patch.extraHour = req.body.extraHour
    patch.extraDuration = req.body.extraDuration

    patch.save().success(function(patch) {
      res.send('ok');
    });

  })

}

exports.updateVisibility = function(req, res) {
  var idPatch = req.body.idPatch;
  var visibility = req.body.visibility;
  console.log(visibility);
  db.PatchSchedule.find(idPatch).success(function(patchSchedule) {
    patchSchedule.visibility = visibility;
    patchSchedule.save().success(function() {
      res.send('ok');
    })
  });

}



exports.teacherHide = function(req, res) {

  db.PatchSchedule.find({
    where: {
      'id': req.body.idPatch
    }
  }).success(function(patch) {

    db.Teacher.find({
      where: {
        'id': req.body.idTeacher
      }
    }).success(function(teacher) {
      patch.addNoVisibleTeacher(teacher);
      res.send('ok')
    })
  })
}

exports.teacherVisible = function(req, res) {

  db.PatchSchedule.find({
    where: {
      'id': req.body.idPatch
    }
  }).success(function(patch) {

    db.Teacher.find({
      where: {
        'id': req.body.idTeacher
      }
    }).success(function(teacher) {
      patch.removeNoVisibleTeacher(teacher);
      res.send('ok')
    })
  })

}