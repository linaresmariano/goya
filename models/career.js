module.exports = function(sequelize, DataTypes) {

  var Career = sequelize.define('Career', {
    nick: DataTypes.STRING,
    name: DataTypes.STRING,
    group: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Career.hasMany(models.Subject, { as: 'subjects', through: 'career_subjects' })
        Career.hasMany(models.Subject, { as: 'dictate', through: 'subject_dictateCareers' })
      }
    }
  })

  return Career
}
