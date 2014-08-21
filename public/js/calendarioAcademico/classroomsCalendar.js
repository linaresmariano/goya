/**
 * calendarApp - 0.1.3
 */




//Controller principal
function CalendarCtrl($scope, $http, $q){
    var date = new Date();
    var d = 26;
    var m = 1;
    var y = 1000;

    /* event source that contains custom events on the scope */
    $scope.events = [
    ];

    $scope.eventClick = function( event, allDay, jsEvent, view ){
       //Curso a mostrar
	   				
	   $scope.courseShow=event;
    };

    

	

    //Agrega un schedule al calendario
    $scope.addSchedule = function(course,schedule) {
      	$scope.events.push({
								id: schedule.id,
								title:  (schedule.semesterClassRoom == undefined ? '' : '\n Aula '+schedule.semesterClassRoom.classRoom.number),
								start: new Date(y, m-1, d+schedule.day, schedule.hour, 0),
								end: new Date(y, m-1, d+schedule.day, schedule.hour+schedule.duration, 0),
								allDay: false,
								backgroundColor: 'green',
								borderColor: 'black',
								//Datos necesarios del modelo
								schedule:schedule,
								course:course,
							});
    };
	
	function getModel(elm,modelName){
			return angular.element(elm).scope().$eval($(elm).attr(modelName));
	}
	
	
	//Elimina de la lista a un schedule asignado
	$scope.removeSchedule = function(schedule) {
		for(i=0;i< $scope.events.length;i++){
			if($scope.events[i].schedule.id == schedule.id){
				$scope.events.splice(i,1);
				return;
			}
		}
		
    };
	

    /* config object */
    $scope.uiConfig = {
      calendar:{
        header:{
          left: '',
          center: '',
          right: ''
        },
		handleWindowResize :true,
		year: y,
		month: m,
		hiddenDays: [6],
		axisFormat: 'H',
		minTime: 8,
		maxTime: 22,
		allDaySlot:false,
		slotMinutes: 30,
		snapMinutes:60,
		dropAccept:".dragg-course",
		slotEventOverlap:false,
		dayNames:['Lunes', 'Martes', 'Miercoles', 'Jueves',
		'Viernes', 'Sabado', 'Domingo'],
		dayNamesShort:['Lun', 'Mar', 'Mie', 'Jue',
		'Vie', 'Sab', 'Dom'],
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


	
	
	//Modelos
	$scope.courses = semesterJSON.courses ;
				

	//Agregando cursos al calendario
	for(i=0; i<$scope.courses.length; i++) {
		for(j=0; j<$scope.courses[i].schedules.length; j++) {

			var curso = $scope.courses[i];
			var horario = curso.schedules[j];
				
				//Si no esta asignada a un horario o dia			
				if((horario.day != -1  || horario.hour != -1 ) && horario.semesterClassRoom != undefined){
					$scope.addSchedule(curso,horario);
				}
			}
	}
	/* event sources array*/
    $scope.eventSources = [$scope.events];		

}
/* EOF */