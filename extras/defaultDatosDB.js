var db = require('../models')


db.Course.destroy().success(function() {

	db.Course.create({
		code: 'EPERS',
		commission: 1,
		semester: 12014,
		enrolled: 25
	})

	db.Course.create({
		code: 'INTRO',
		commission: 2,
		semester: 12014,
		enrolled: 30
	})

	db.Course.create({
		code: 'ORGA',
		commission: 4,
		semester: 12014,
		enrolled: 45
	})

	db.Course.create({
		code: 'SEGI',
		commission: 1,
		semester: 12014,
		enrolled: 20
	})

})
