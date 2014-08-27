var app = angular.module('APP', ['LocalStorageModule','ui.calendar', 'ui.bootstrap']);


app.controller('WebController', function ($scope, localStorageService, $http) {
	if(localStorageService.get('year') == undefined && localStorageService.get('number') == undefined) {
		$http({
				url:"/lastSemester",
				method:'get',
				data: {}
		}).success(function(data) {
			$scope.year=data.semester.year
			$scope.number=data.semester.number
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


app.controller('newSubjectCtrl', function ($scope, localStorageService, subjectService) {

  $scope.areas = subjectService.areas

  $scope.cores = subjectService.cores

  $scope.modalities = subjectService.modalities
  
})


app.service('subjectService', function() {

   this.areas = [
    {id:0, name:'Programación'},
    {id:1, name:'Sistemas Informáticos'},
    {id:2, name:'Matemática Básica'},
    {id:3, name:'Matemática Superior'},
    {id:4, name:'Idioma'}
  ]

  this.cores = [
    {id:0, name:'Básico Obligatorio'},
    {id:1, name:'Avanzado Obligatorio'},
    {id:2, name:'Complementaria'},
    {id:3, name:'Obligatoria'}
  ]

  this.modalities = [
    {id:0, name:'Presencial'},
    {id:1, name:'Presencial con campus virtual'},
    {id:2, name:'Virtual'}
  ]

})