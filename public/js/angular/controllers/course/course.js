
app.controller('courseCtrl', function ($scope, localStorageService, subjectService) {

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

  $scope.remove=function(index){
    $scope.course.schedules.splice(index,1);
  }

  $scope.add = function(hour, durationHour, day) {
    if(hour && durationHour && day && !isRepeat(hour, durationHour, day)) {
      $scope.course.schedules.push({
        day: day.id,
        hour: hour,
        durationHour: durationHour
      })
    }
  }

  function isRepeat(hour, durationHour, day) {
    for(i =0; i < $scope.course.schedules.length; i++){
    schedule=$scope.course.schedules[i];
      if(schedule.day == day.id && schedule.hour == hour && schedule.durationHour == durationHour){
        return true;
      }
    };
    return false;
  }

  $scope.colors = [
    {name: 'Negro', id: 'black'},
    {name: 'Blanco', id: 'white'},
    {name: 'Rojo', id: 'red'},
    {name: 'Azul', id: 'blue'},
    {name: 'Amarillo', id: 'yellow'},
    {name: 'Verde', id: 'green'}
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
