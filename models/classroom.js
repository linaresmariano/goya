module.exports = function(sequelize, DataTypes) {

  return sequelize.define('ClassRoom', {
	name:{type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 100],
            msg: 'El nombre del aula debe contener entre 4 y 100 caracteres'
        },
        notEmpty:true,
		notNull:true
      }
    },
	number: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [1, 25],
            msg: 'La numero del  aula debe tenes entre 1 y 25 caracteres'
        },
        notEmpty:true,
		notNull:true
      }
    },
	description: {type:DataTypes.STRING,
      validate: {
        len: {
            args: [4, 200],
            msg: 'La descripcion del  aula debe tenes entre 4 y 200 caracteres'
        },
         notEmpty:true,
		notNull:true
      }
    },
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
