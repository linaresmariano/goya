var db = require('../../models')


exports.create = function(req, res) {

    res.render('subject/create', {
      title: 'Crear Materia'
    })


}



