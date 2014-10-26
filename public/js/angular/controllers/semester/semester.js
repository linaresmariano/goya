
app.controller('semesterCtrl', function ($scope, Semester) {

  $scope.init = function(semester, semesters) {

    if(semesters) {
      $scope.semesters = semesters.map(function(elem) {
        return new Semester(elem)
      })
    }

    if(semester) {
      $scope.semester = semester
    } else {
      $scope.semester = {}
      $scope.semester.year = new Date().getFullYear()
      $scope.semester.semester = 1
    }
  }

  $scope.isEditing = function() {
    return $scope.semester.id != undefined
  }

})
