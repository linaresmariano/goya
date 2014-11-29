function CalendarCtrl($scope, $http, $q, Semester) {
    var date = new Date();
    var d = 26;
    var m = 1;
    var y = 1000;

    //Modelos
    $scope.courses = semesterJSON.courses;

    $scope.semester = new Semester({
      assignedSchedules: [],
      schedulesAreNotAssigned: [],
      teachers: [],
      classRooms: [],
      courses: semesterJSON.courses
    });

    /* event source that contains custom events on the scope */
    $scope.events = [];

    /* Configuracion de la grilla */
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

    //Agrega un schedule al calendario
    $scope.addSchedule = function(schedule) {
      var time = schedule.getStartAndEndTimes();

      $scope.events.push({
        id: schedule.id,
        title: schedule.semesterClassRoom.getDescription(),
        start: new Date(y, m - 1, d + schedule.day, time.startHour, time.startMinutes),
        end: new Date(y, m - 1, d + schedule.day, time.endHour, time.endMinutes),
        allDay: false,
        backgroundColor: 'green',
        textColor: 'white',
        borderColor: 'black',
        //Datos necesarios del modelo
        schedule: schedule
      })
    }

    $scope.semester.assignedSchedules.forEach(function(schedule) {
      if (schedule.semesterClassRoom)
        $scope.addSchedule(schedule);
    });

    /* event sources array*/
    $scope.eventSources = [$scope.events];

  }
  /* EOF */