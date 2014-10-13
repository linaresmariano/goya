
app.controller('listTeachersCtrl', function ($scope, $q, $http, $window) {
  
  $scope.removeTeacher = function(id, index) {
    var deferred = $q.defer();

    $http({
      url:"/teacher/remove",
      method:'put',
      data: { idTeacher:id}
    }).success(function(data) {
      
      deferred.resolve(index);
                  
    }).error(function(err){
      alert("Error al borrar un profesor");
    });
        
    var promise = deferred.promise;
    promise.then(function(index) {
      $scope.teachers.splice(index,1);
    });
  }
  
})
