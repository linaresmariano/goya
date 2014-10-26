
app.controller('semesterCtrl', function ($scope) {

  $scope.init = function(semester) {

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
