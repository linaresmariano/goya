var db = require('./');
var sequelize = db.sequelize;

exports.testClonePatch = function(test) {
  var patch = {
    visibility: true,
    extraHour: 1.5,
    extraDuration: 1,
  };
  clonePatch = db.PatchSchedule.clonePatch(patch);
  test.equal(clonePatch.visibility, patch.visibility, "clonePatch.visibility  should be patch.visibility");
  test.equal(clonePatch.extraHour, patch.extraHour, "clonePatch.extraHour  should be patch.extraHour");
  test.equal(clonePatch.extraDuration, patch.extraDuration, "clonePatch.extraDuration  should be patch.extraDuration");
  test.done();
}