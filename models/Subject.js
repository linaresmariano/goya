
module.exports = function(sequelize, DataTypes) {

  var Subject = sequelize.define('Subject', {
    area: DataTypes.INTEGER,
    core: DataTypes.INTEGER,
    period: DataTypes.STRING,
    ocode: DataTypes.STRING,
    credits: DataTypes.INTEGER,
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
        Subject.hasMany(models.Career, { as: 'dictateCareers', through: 'subject_dictateCareers'})
        Subject.belongsTo(models.Career, { as: 'career', through: 'career_subjects' })
      }
    }
  })

  return Subject
}
