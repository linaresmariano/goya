
app.controller('listTeachersCtrl', function ($scope, $q, $http, $window) {
  
  $scope.removeTeacher = function(teacher, index) {

    if(confirm("¿Está seguro que desea borrar al profesor "+ teacher.name +"?")) {

      var deferred = $q.defer();

      $http({
        url: "/teacher/remove",
        method: 'put',
        data: {idTeacher: teacher.id }
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
  }
  
})
