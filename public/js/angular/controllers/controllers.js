var app = angular.module('APP', ['LocalStorageModule','ui.calendar', 'ui.bootstrap']);


app.controller('WebController', function ($scope, localStorageService, $http) {
	if((localStorageService.get('year') == undefined
			|| localStorageService.get('year') == -1) && (localStorageService.get('number') == undefined
					|| localStorageService.get('number') == -1)) {
		$http({
				url:"/semester/last",
				method:'get',
				data: {}
		}).success(function(data) {
			$scope.year=!data.semester ? -1 : data.semester.year
			$scope.number=!data.semester ? -1 : data.semester.number
			localStorageService.set('year', $scope.year)
			localStorageService.set('number', $scope.number)
		}).error(function(err) {
			alert('Error al conectar con el servidor.')
		})
	} else {
		$scope.year = localStorageService.get('year')
		$scope.number = localStorageService.get('number')
	}
})


app.controller('SemestralGrids', function ($scope, localStorageService, $location) {
  $scope.semesters = semestersJSON;
  $scope.currentSemester=function(year,number){
			localStorageService.set('year',year);
			localStorageService.set('number',number);
			window.location='/';
	}
  
})
