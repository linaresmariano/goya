module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ClassRoom', {
	name: DataTypes.STRING,
	number: DataTypes.STRING,
	description: DataTypes.STRING,
    capacity: DataTypes.INTEGER,
	numberOfComputers: DataTypes.INTEGER,
	hasProyector: DataTypes.BOOLEAN
  }, {
  })
  
}
