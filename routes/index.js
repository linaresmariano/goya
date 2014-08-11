var db = require('../models')
/*
 * GET home page.
 */

exports.index = function(req, res){

  db.Semester.findAll({
		include: [ {	model: db.Teacher, as: 'Teachers' ,require:false}],
		order:' year DESC ,semester DESC'
	}).success(function(semesters) {
    res.render('index', {
      title: 'Semestres',
      semesters: semesters
    })
  })

};