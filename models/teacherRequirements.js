module.exports = function(sequelize, DataTypes) {

  return sequelize.define('TeacherRequirements', {
    	numberOfComputers: DataTypes.INTEGER,
		proyector: DataTypes.BOOLEAN,
		extraRequirements: DataTypes.STRING
	},{
  })

}