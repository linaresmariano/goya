var csv = require('csv')
var fs  = require('fs')
var db = require('../../models')

// Archivo a importar
var file = './extras/loadCSV/subjects.csv'

var input = fs.createReadStream(file)


input.addListener('data', function(data) {

  csv.parse(data, {comment: '#'}, function(err, output) {
    // Eliminar el header
    // AREA,CORE,PERIOD,OCODE,CREDITS,NICK,NAME
    output.shift()

    // Recorrer cada uno y crearlo en la base
    output.forEach(function(elem) {

      var area = elem[0]
      var core = elem[1]
      var period = elem[2]
      var ocode = elem[3]
      var credits = elem[4]
      var nick = elem[5]
      var name = elem[6]
      var career = elem[7]

      db.Subject.create({
        area: area,
        core: core,
        period: period,
        ocode: ocode,
        credits: credits,
        nick: nick,
        name: name
      }).success(function(subject) {
        db.Career.find({where: {nick: career}}).success(function(career) {
          if(career) {
            subject.setCareer(career);
          }
        })
      })
  
    })
  })
})
