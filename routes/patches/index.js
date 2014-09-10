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
