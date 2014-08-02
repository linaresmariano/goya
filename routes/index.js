var db = require('../models')
/*
 * GET home page.
 */

exports.index = function(req, res){

  db.Semester.findAll().success(function(semesters) {
    res.render('index', {
      title: 'Semestres',
      semesters: semesters
    })
  })

};