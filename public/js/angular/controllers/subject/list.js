
app.controller('listSubjectsCtrl', function ($scope, $q, $http, $window) {
  
  $scope.remove = function(subject, index) {

    if(confirm("¿Está seguro que desea borrar la materia "+subject.name+"?")) {
      var deferred = $q.defer();

      $http({
        url:"/subject/remove",
        method:'put',
        data: {id: subject.id}
      }).success(function(data) {
        
        deferred.resolve(index);
                    
      }).error(function(err){
        alert("Error al borrar la materia");
      });
          
      var promise = deferred.promise;
      promise.then(function(index) {
        $scope.subjects.splice(index,1);
      });
    }
  }
  
})
