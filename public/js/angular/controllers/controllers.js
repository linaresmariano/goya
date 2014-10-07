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

  $scope.dictateCareers = []

  $scope.addDictate = function(dictate){
    if(dictate != null && !isRepeat(dictate)) {
      $scope.dictateCareers.push(dictate)
    }
  }

  function isRepeat(dictate){
    for(i =0; i < $scope.dictateCareers.length; i++) {
      var career = $scope.dictateCareers[i]
      if(career.id == dictate.id) {
        return true
      }
    }

    return false
  }

  $scope.remove = function(index) {
    $scope.dictateCareers.splice(index, 1)
  }
  
})


app.controller('editSubjectCtrl', function ($scope, localStorageService, subjectService) {

  $scope.areas = subjectService.areas

  $scope.cores = subjectService.cores

  $scope.addDictate = function(dictate){
    if(dictate != null && !isRepeat(dictate)) {
      $scope.dictateCareers.push(dictate)
    }
  }

  function isRepeat(dictate){
    for(i =0; i < $scope.dictateCareers.length; i++) {
      var career = $scope.dictateCareers[i]
      if(career.id == dictate.id) {
        return true
      }
    }

    return false
  }

  $scope.remove = function(index) {
    $scope.dictateCareers.splice(index, 1)
  }

  $scope.init = function(careers, subject) {
    $scope.careers = careers
    $scope.subject = subject
    $scope.dictateCareers = subject.dictateCareers

    $scope.career = getById(careers, subject.CareerId)
    $scope.area = subjectService.areas[subject.area]
    $scope.core = subjectService.cores[subject.core]
  }

  // PREC: ID is in an element of list
  function getById(list, id) {
    for(var i = 0; i < list.length; i++) {
      if(list[i].id == id) {
        return list[i]
      }
    }
  }
  
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


app.controller('createCourseCtrl', function ($scope,localStorageService, subjectService) {

  $scope.modalities = subjectService.modalities

  $scope.hours = []
  for(i=8;i<21;i++){
    $scope.hours.push(i);
  }

  $scope.durations = [];
  for(i=2;i<7;i++){
    $scope.durations.push(i);
  }

  $scope.days = [
    {name:'Lunes',id:0},
    {name:'Martes',id:1},
    {name:'Miercoles',id:2},
    {name:'Jueves',id:3},
    {name:'Viernes',id:4},
    {name:'Sabado',id:5}
  ];

  $scope.schedules = [];

  $scope.remove=function(index){
    $scope.schedules.splice(index,1);
  }

  $scope.add=function(hour,duration,day,id){
    if(hour != undefined  && 
    duration != undefined && 
    day != undefined && 
    id != undefined && 
    !isRepeat(hour,duration,day)){
      $scope.schedules.push({day:day,id:id,hour:hour,duration:duration});
    }
    
  }

  function isRepeat(hour,duration,day){
    for(i =0;i < $scope.schedules.length;i++){
    schedule=$scope.schedules[i];
      if(schedule.day == day && schedule.hour == hour && schedule.duration == duration){
        return true;
      }
    };
    return false;
  }

  $scope.colors = [
    {name: 'Negro', value: 'black'},
    {name: 'Blanco', value: 'white'},
    {name: 'Rojo', value: 'red'},
    {name: 'Azul', value: 'blue'},
    {name: 'Amarillo', value: 'yellow'}
  ]
})