var conexion = require('./db')


var curso_cuatrimestral_schema = new conexion.mongoose.Schema({
  code : String,
  comision : Number,
  cuatrimestre : Number,
  inscriptos : Number,
  configVista : {
					color : String
                },
  requisitos : {
					computadoras : Boolean
               },
  horarios: [{
					dia : Number,
					hora: Number,
                    minutos: Number,
                    duracion: Number,
					tipo: String
             }]
})

module.exports =conexion.db.model('CursoCuatrimestral', curso_cuatrimestral_schema)