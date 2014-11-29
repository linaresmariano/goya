/**
 * calendarApp - 0.1.3
 */
//Controller principal
function CalendarCtrl($scope, $http, $q) {
    var date = new Date();
    var d = 26;
    var m = 1;
    var y = 1000;

    /* event source that contains custom events on the scope */
    $scope.events = [];

    $scope.eventClick = function(event, allDay, jsEvent, view) {
      //Curso a mostrar

      $scope.courseShow = event;
    };


    function getMinutes(floatNumber) {
      sign = floatNumber >= 0 ? 1 : -1;
      return (floatNumber + "").split(".").length == 1 ? 0 : ((floatNumber + "").split(".")[1] - 2) * 10 * sign;
    }

    function getHour(floatNumber) {
      return parseInt(floatNumber);
    }


    //Agrega un schedule al calendario
    $scope.addSchedule = function(schedule) {

      extraHour = getHour(schedule.patch.extraHour);
      extraMinutes = getMinutes(schedule.patch.extraHour);

      extraHourDuration = getHour(schedule.patch.extraDuration);
      extraMinutesDuration = getMinutes(schedule.patch.extraDuration);
      $scope.events.push({
        id: schedule.id,
        title: 'Aula ' + schedule.semesterClassRoom.classRoom.number,
        start: new Date(y, m - 1, d + schedule.day, schedule.hour + extraHour, schedule.minutes + extraMinutes),
        end: new Date(y, m - 1, d + schedule.day, schedule.hour + schedule.durationHour + extraHour + extraHourDuration, schedule.minutes + schedule.durationMinutes + extraMinutes + extraMinutesDuration),
        allDay: false,
        backgroundColor: 'green',
        borderColor: 'black',
        //Datos necesarios del modelo
        schedule: schedule
      });
    };

    function getModel(elm, modelName) {
      return angular.element(elm).scope().$eval($(elm).attr(modelName));
    }


    //Elimina de la lista a un schedule asignado
    $scope.removeSchedule = function(schedule) {
      for (i = 0; i < $scope.events.length; i++) {
        if ($scope.events[i].schedule.id == schedule.id) {
          $scope.events.splice(i, 1);
          return;
        }
      }

    };


    /* config object */
    $scope.uiConfig = {
      calendar: {
        header: {
          left: '',
          center: '',
          right: ''
        },
        handleWindowResize: true,
        year: y,
        month: m,
        hiddenDays: [6],
        axisFormat: 'H',
        minTime: 8,
        maxTime: 22,
        allDaySlot: false,
        slotMinutes: 30,
        snapMinutes: 60,
        dropAccept: ".dragg-course",
        slotEventOverlap: false,
        dayNames: ['Lunes', 'Martes', 'Miercoles', 'Jueves',
          'Viernes', 'Sabado', 'Domingo'
        ],
        dayNamesShort: ['Lun', 'Mar', 'Mie', 'Jue',
          'Vie', 'Sab', 'Dom'
        ],
        columnFormat: {
          month: 'ddd',
          week: 'ddd ',
          day: 'dddd '
        },
        editable: false,
        droppable: false,
        firstHour: 8,
        defaultView: 'agendaWeek'
      }
    };

    $scope.existsSchedule = function(schedule) {

      for (p = 0; p < $scope.events.length; p++) {
        if ($scope.events[p].schedule.id == schedule.id) {
          return true;
        }
      }

      return false;
    };


    //Modelos
    $scope.courses = semesterJSON.courses;


    //Agregando cursos al calendario
    for (i = 0; i < $scope.courses.length; i++) {
      for (j = 0; j < $scope.courses[i].schedules.length; j++) {

        var curso = $scope.courses[i];
        var horario = curso.schedules[j];

        //Si no esta asignada a un horario o dia			
        if (!(horario.day == -1 || horario.hour == -1) && horario.semesterClassRoom != undefined) {
          if (!$scope.existsSchedule(horario)) {
            $scope.addSchedule(horario);
          }

        }
      }

    }


    /* event sources array*/
    $scope.eventSources = [$scope.events];

  }
  /* EOF */