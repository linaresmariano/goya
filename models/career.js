module.exports = function(sequelize, DataTypes) {

  var Career = sequelize.define('Career', {
    nick: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        Career.hasMany(models.Subject, { as: 'subjects'})
        Career.belongsTo(models.Subject, { as: 'dictate'})
      }
    }
  })

  return Career
}
