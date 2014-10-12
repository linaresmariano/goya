
app.controller('classroomCtrl', function ($scope, localStorageService, subjectService) {

  $scope.init = function(classroom) {

    if(classroom) {
      $scope.classroom = classroom
    } else {
      $scope.classroom = {}
    }
  }

  $scope.isEditing = function() {
    return $scope.classroom.id != undefined
  }

})
