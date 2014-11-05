var db = require('../models')
/*
 * GET home page.
 */

exports.index = function(req, res){

  db.Semester.findAll({
		order:' year DESC ,semester DESC'
	}).success(function(semesters) {
    res.render('index', {
      title: 'Semestres',
      semesters: semesters
    })
  })

};

