module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ClassRoom', {
	name: DataTypes.STRING,
	number: DataTypes.STRING,
	description: DataTypes.STRING,
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
	numberOfComputers: {type:DataTypes.INTEGER ,  validate: {min:0}},
	hasProyector: DataTypes.BOOLEAN
  },{classMethods: {
			associate: function(models) {
			  this.hasMany(models.SemesterClassRoom, { as: 'SemesterClassRoom'});
			}
		}
    })
  
}
