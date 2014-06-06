var db = require('../models'),
    fs = require('fs'),
    path = require('path')
    classrooms = __dirname + '/historial/classrooms.json';


require(classrooms).classrooms
  .forEach(function(file) {
//     return (file.indexOf('.') !== 0) && (file !== 'index.js')
//   })
//   .forEach(function(file) {
//     var model = sequelize.import(path.join(__dirname, file))
//     db[model.name] = model
  })