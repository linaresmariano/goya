app.factory('Patch', ['$http', function($http) {
  function Patch(data) {
    if (data) {
      angular.extend(this, data)
    }
  };

  Patch.prototype = {
    getExtraDuration: function() {
      return this.extraDuration;
    },

    getExtraHour: function() {
      return this.extraHour;
    },

    setExtraDuration: function(extraDuration) {
      this.extraDuration = extraDuration;
    },

    setExtraHour: function(extraHour) {
      this.extraHour = extraHour;
    },

    removeNoVisibleTeacher: function(teacher) {
      for (j = 0; j < this.noVisibleTeachers.length; j++) {
        if (teacher.id == this.noVisibleTeachers[j].id) {
          this.noVisibleTeachers.splice(j, 1);
        }
      }
    },

    addNoVisibleTeacher: function(teacher) {
      this.noVisibleTeachers.push(teacher);
    },

    changeVisibility: function() {
      this.visibility = !this.visibility;
    }
  };
  return Patch;
}]);