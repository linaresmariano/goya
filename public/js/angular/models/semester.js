app.factory('Semester', ['$http', function($http) {
  function Semester(data) {
    if (data) {
      angular.extend(this, data)
    }
    // Some other initializations related to semester
  };

  Semester.prototype = {

    getDescription: function() {
      return 'Semestre '+ this.semester +' del año '+ this.year;
    }

  };

  return Semester;
}]);
