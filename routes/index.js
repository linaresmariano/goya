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

exports.lastSemester = function(req, res){

  db.Semester.findAll({
		order:' year DESC ,semester DESC',
		limit: 1
	}).success(function(semesters) {
		res.json({ semester: { year: semesters[0].year , number: semesters[0].semester } });
  })

};