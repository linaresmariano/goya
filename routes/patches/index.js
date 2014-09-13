var db = require('../../models')


exports.update = function(req, res) {

  db.PatchSchedule.find({
    where:{ 'id': req.body.patchId }
  }).success(function(patch) {

    patch.extraHour = req.body.extraHour
    patch.extraDuration = req.body.extraDuration

    patch.save()

  })

}



exports.teacherHide = function(req, res) {

  db.PatchSchedule.find({
    where:{ 'id': req.body.idPatch }
  }).success(function(patch) {
  
	db.Teacher.find({
    where:{ 'id': req.body.idTeacher }
	  }).success(function(teacher) {
		patch.addNoVisibleTeacher(teacher);
		res.send('ok')
	  })
  })
}

exports.teacherVisible = function(req, res) {

  db.PatchSchedule.find({
    where:{ 'id': req.body.idPatch }
  }).success(function(patch) {
  
	db.Teacher.find({
    where:{ 'id': req.body.idTeacher }
	  }).success(function(teacher) {
		patch.removeNoVisibleTeacher(teacher);
		res.send('ok')
	  })
  })

}
