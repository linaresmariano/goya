
app.controller('SemestralGrids', function ($scope,localStorageService, $location) {
  $scope.semesters = semestersJSON;
  $scope.currentSemester=function(year,number){
			localStorageService.set('year',year);
			localStorageService.set('number',number);
			window.location='/';
	}
  
})
