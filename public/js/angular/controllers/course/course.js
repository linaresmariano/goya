
app.controller('courseCtrl', function ($scope, $q, $http, localStorageService, subjectService) {

  $scope.modalities = subjectService.modalities

  $scope.init = function(subjects, course) {
    $scope.subjects = subjects

    if(course) {
      $scope.course = course

      $scope.course.subject = getById(subjects, course.SubjectId)

      $scope.course.modality = subjectService.modalities[course.modality]
      $scope.course.color = getById($scope.colors, course.color)

      console.log(course)

    } else {
      $scope.course = {}
      $scope.course.schedules = []
      $scope.course.enrolled = 0
    }
  }

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

  $scope.remove = function(schedule, index) {

    if(confirm("¿Está seguro que desea borrar el horario?")) {

      if(schedule.id) {
        var deferred = $q.defer();

        $http({
          url:"/schedule/delete",
          method:'put',
          data: {id: schedule.id}
        }).success(function(data) {
          
          deferred.resolve(index);
                      
        }).error(function(err){
          alert("Error al borrar un curso");
        });
            
        var promise = deferred.promise;
        promise.then(function(index) {
          $scope.course.schedules.splice(index, 1);
        });

      } else {

        $scope.course.schedules.splice(index, 1);

      }
    }

  }

  $scope.add = function(hour, durationHour, day,scheduleType) {
    if(hour && durationHour && day && scheduleType &&
					!isRepeat(hour, durationHour, day,scheduleType)) {
      $scope.course.schedules.push({
        day: day.id,
        hour: hour,
		type: scheduleType,
        durationHour: durationHour
      })
    }
  }

  function isRepeat(hour, durationHour, day,scheduleType) {
    for(i =0; i < $scope.course.schedules.length; i++){
    schedule=$scope.course.schedules[i];
      if(schedule.day == day.id && schedule.hour == hour
			&& schedule.durationHour == durationHour
			&& scheduleType == schedule.type){
        return true;
      }
    };
    return false;
  }
  
  $scope.scheduleTypes=['Teorica/Practica','Teorica','Practica'];

  $scope.colors = [
    {name: 'Verde', id: 'green', font: 'black'},
    {name: 'Amarillo', id: 'yellow', font: 'black'},
    {name: 'Naranja', id: 'orange', font: 'black'},
    {name: 'Marrón', id: 'brown', font: 'white'},
    {name: 'Rojo', id: 'red', font: 'white'},
    {name: 'Azul', id: 'blue', font: 'white'},
    {name: 'Rosa', id: 'pink', font: 'black'}
  ]

  function getById(list, id) {
    for(var i = 0; i < list.length; i++) {
      if(list[i].id == id) {
        return list[i]
      }
    }
  }

  $scope.isEditing = function() {
    return $scope.course.id != undefined
  }

  $scope.scheduleAssigned = function(schedule) {
    if(schedule.hour < 0) {
      return 'Sin horario asignado'
    }
    
    return 'El día '+ getById($scope.days, schedule.day).name +' a las '+ schedule.hour
  }

})
