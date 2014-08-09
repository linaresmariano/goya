var db = require('./tests');

module.exports = function(grunt) {

    // Project configuration.                                                                                                                                                                
    grunt.initConfig({
		nodeunit: {
			all: ['./tests/**/*Test.js']
		}
    });
	
	//tarea para ejecutar los tests con base de datos de prueba
	grunt.registerTask('runtests', 'Run all the test', function() {
		var done = this.async();
		db
		 .sequelize
		  .sync({ force: true })
		  .complete(function(err) {
			if (err) {
			  throw err[0]
			} else {
				var saveData=require('./extras/initialDataDBTest');
				saveData(function(){
					grunt.task.run('nodeunit');
					done();
				});
				
			}
		});
	});

    // Load nodeunit task                                                                                                                                                                
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

};