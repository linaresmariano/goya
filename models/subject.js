module.exports = function(sequelize, DataTypes) {

  var Subject = sequelize.define('Subject', {
    area: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        notNull: true
      }
    },
    core: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0,
        notNull: true
      }
    },
    period: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [3, 100],
          msg: 'El período de la materia debe contener entre 2 y 100 caracteres'
        },
        notEmpty: true,
        notNull: true
      }
    },
    ocode: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 100],
          msg: 'El código de la materia debe contener entre 1 y 100 caracteres'
        },
        notEmpty: true,
        notNull: true
      }
    },
    credits: {
      type: DataTypes.INTEGER,
      validate: {
        min: 0
      }
    },
    nick: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [2, 12],
          msg: 'El nick de la materia debe contener entre 2 y 12 caracteres'
        },
        notEmpty: true,
        notNull: true
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [4, 100],
          msg: 'El nombre de la materia debe contener entre 4 y 100 caracteres'
        },
        notEmpty: true,
        notNull: true
      }
    },
  }, {
    deletedAt: 'destroyTime',
    paranoid: true,
    classMethods: {
      associate: function(models) {
        Subject.hasMany(models.Course, {
          as: 'Courses'
        })
        Subject.hasMany(models.Career, {
          as: 'dictateCareers',
          through: 'subject_dictateCareers'
        })
        Subject.belongsTo(models.Career, {
          as: 'career',
          through: 'career_subjects'
        })
      }
    }
  })

  return Subject
}