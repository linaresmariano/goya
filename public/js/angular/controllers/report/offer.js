app.controller('offerCtrl', function ($scope, localStorageService, subjectService) {

  $scope.init = function(semester) {

    $scope.semester = semester;

    $scope.courses = $scope.semester.courses.filter(shouldDisplayCourse)

  }

  var weekday = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

  $scope.scheduleView = function(schedule) {
    //para calcular la hora final,teniendo en cuenta las media horas
    seconds=Math.abs(schedule.durationMinutes +schedule.minutes +(schedule.hour*60)+ (schedule.durationHour * 60) )*60;
    hourDuration=Math.abs(parseInt(seconds/3600));
    minutesDuration=Math.abs(parseInt((seconds-(3600*hourDuration))/60));

    return schedule.hour > 0 ?
      weekday[schedule.day]+" "+schedule.hour+":"+addZero(schedule.minutes)+" a "+addZero(hourDuration)+":"+addZero(minutesDuration) :
      ""
  }

  function addZero(number) {
    if( number == 0){
      return number+"0";
    };
    return number;
  }

  $scope.classroomView = function(schedule) {
    return schedule.hour > 0 && schedule.semesterClassRoom ?
      schedule.semesterClassRoom.classRoom.number :
      ''
  }

  $scope.getArea = function(index) {
    return subjectService.areas[index].name
  }

  $scope.getCore = function(index) {
    return subjectService.cores[index].name
  }

  $scope.getModality = function(index) {
    return subjectService.modalities[index].name
  }

  function shouldDisplayCourse(course, index, ar) {
    if(course.schedules.length == 0) {
      return false
    }

    var someHour = false
    for (var i = course.schedules.length - 1; i >= 0; i--) {
      someHour = someHour || course.schedules[i].hour > 0
    }

    return someHour
  }
})
