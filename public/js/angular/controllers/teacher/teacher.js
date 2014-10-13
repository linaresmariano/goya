
app.controller('teacherCtrl', function ($scope) {

  $scope.init = function(teacher) {

    if(teacher) {
      $scope.teacher = teacher
    } else {
      $scope.teacher = {}
    }
  }

  $scope.isEditing = function() {
    return $scope.teacher.id != undefined
  }

})
