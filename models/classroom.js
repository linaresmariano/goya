module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ClassRoom', {
    code: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
  }, {
  })
  
}
