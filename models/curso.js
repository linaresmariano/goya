var conexion = require('./db')


var curso_schema = new conexion.mongoose.Schema({
  code         :   String,
  comision     :   Number,
  cuatrimestre :   Number,
  inscriptos   :   Number,
  configVista  : {
		   color : String
                 },
  requisitos   : {
		   computadoras : Boolean
                 },
  horarios     :[{
		   dia : Number,
		   hora: Number,
                   minutos: Number,
                   duracion: Number,
		   tipo: String
                 }],
  profesores: [conexion.mongoose.Schema.Types.ObjectId]
})

module.exports =conexion.db.model('Curso', curso_schema)
