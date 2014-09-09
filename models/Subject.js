
module.exports = function(sequelize, DataTypes) {

  var Subject = sequelize.define('Subject', {
    area: DataTypes.INTEGER,
    core: DataTypes.INTEGER,
    period: DataTypes.STRING,
    modality: DataTypes.INTEGER,
    ocode: DataTypes.STRING,
    credits: DataTypes.INTEGER,
    capacity: {type:DataTypes.INTEGER ,  validate: {min:0}},
    nick: DataTypes.STRING,	
    name: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 100],
            msg: 'El nombre de la materia debe contener entre 4 y 100 caracteres'
        },
        notEmpty:true
      }
    },
  },{
    classMethods: {
      associate: function(models) {
        Subject.hasMany(models.Course, { as: 'Courses'})
        Subject.hasMany(models.Career, { as: 'dictateCareers'})
        Subject.belongsTo(models.Career, { as: 'career'})
      }
    }
  })

  return Subject
}
