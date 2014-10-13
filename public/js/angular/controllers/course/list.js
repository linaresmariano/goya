
app.controller('listCoursesCtrl', function ($scope, $q, $http, $window) {
  
  $scope.remove = function(course, index) {

    if(confirm("¿Está seguro que desea borrar el curso "+course.subject.name+" comisión "+course.commission+"?")) {
      var deferred = $q.defer();

      $http({
        url:"/course/remove",
        method:'put',
        data: {id: course.id}
      }).success(function(data) {
        
        deferred.resolve(index);
                    
      }).error(function(err){
        alert("Error al borrar un curso");
      });
          
      var promise = deferred.promise;
      promise.then(function(index) {
        $scope.courses.splice(index,1);
      });
    }
  }
  
})
