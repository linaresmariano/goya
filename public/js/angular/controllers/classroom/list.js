app.controller('listClassroomsCtrl', function($scope, $q, $http, $window) {

  $scope.remove = function(classroom, index) {

    if (confirm("¿Está seguro que desea borrar el aula?")) {
      var deferred = $q.defer();

      $http({
        url: "/classroom/remove",
        method: 'put',
        data: {
          id: classroom.id
        }
      }).success(function(data) {

        deferred.resolve(index);

      }).error(function(err) {
        alert("Error al borrar el aula");
      });

      var promise = deferred.promise;
      promise.then(function(index) {
        $scope.classRooms.splice(index, 1);
      });
    }
  }

})