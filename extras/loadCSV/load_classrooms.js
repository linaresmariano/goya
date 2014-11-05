var csv = require('csv')
var fs  = require('fs')
var db = require('../../models')

// Archivo a importar
var file = './extras/loadCSV/classrooms.csv'

var input = fs.createReadStream(file)


input.addListener('data', function(data) {

  csv.parse(data, {}, function(err, output) {
    // Eliminar el header
    output.shift()

    // Recorrer cada uno y crearlo en la base
    output.forEach(function(elem) {
      var name = elem[0]
      var number = elem[1]
      var description = elem[2]
      var capacity = elem[3]
      var computers = elem[4]
      var proyector = elem[5] === 'TRUE'

      db.ClassRoom.create({
        name: name,
        number: number,
        description: description,
        capacity: capacity,
        numberOfComputers: computers,
        hasProyector: proyector
      })

    })
  
  })

})
