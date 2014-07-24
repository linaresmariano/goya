/**
 * calendarApp - 0.1.3
 */

var app=angular.module('APP', ['ui.calendar', 'ui.bootstrap']);


app.directive('draggableCourse', function() {
			return {
				restrict: 'A',
				link: function(scope, elm, attrs) {
				//Obteniendo valor del atributo model
				var model = scope.$eval(attrs.draggModel);

				var eventObject = {
						title: model.code, 
						id: model.id,
						commission: model.commission,
						duration: model.duration,
						color: model.color
				};

				elm.data('eventObject', eventObject);

				elm.draggable({
					zIndex: 999,
					revert: true,      
					revertDuration: 0 ,
					stop: function( event, ui ) {}
				});         

				}
			};
});

//Creando directive droppable con jquery ui
app.directive('draggTeacher', function() {
	return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				//Necesita de position absolute,para droppear a los eventos del calendar
				//elm.css('position','absolute');

				elm.draggable({
				start: function( event, ui ) {
				},
				drag: function( event, ui ) {

				},
				zIndex: 999,
				revert: true,      
				revertDuration: 0 ,
				stop: function( event, ui ) {}
			}); 
			}
		};
});
		
//Creando estilo menuTeachers,para solucionar el problema de la posicion absoluta que se requiere para dropear
app.directive('menuTeachers', function() {
	return {
			restrict: 'C',
			link: function(scope, elm, attrs) {
				var space = attrs.space;
					
				elm.css("margin-top",space);
				elm.css("position","absolute");
			}
		};
});

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
        alert(event.title + ' was clicked ');
    };

     $scope.eventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       		if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			  $.ajax({url:"/actualizarCurso",
						method:'post',
						data: {
							id:event.id, hour:event.start.getHours(), day:event.start.getDay()
						},
						success:function(result){
                        	//Por ahora nada
						},
						error:function(err){
							revertFunc();
							alert('Error al actualizar dato,es posible que no este conectado a internet.');
						}
					});
			}
    };
	

	
	$scope.drop= function(date, allDay) { // this function is called when something is dropped

				// retrieve the dropped element's stored Event Object
				var originalEventObject = $(this).data('eventObject');

					// we need to copy it, so that multiple events don't have a reference to the same object
					var copiedEventObject = $.extend({}, originalEventObject);

					$http({
							url:"/actualizarCurso",
							method:'post',
							data: { id:copiedEventObject.id, hour:date.getHours(),day:date.getDay()}
					}).success(function(data) {
						$scope.events.push({	id: copiedEventObject.id,
												title: copiedEventObject.title,
												start: new Date(y, m-1, date.getDay()+d,date.getHours(),0),
												end: new Date(y, m-1, date.getDay()+d, date.getHours()+copiedEventObject.duration, 0),
												allDay: false,
												backgroundColor: copiedEventObject.color,
												borderColor: 'black'
											});
						
						
					}).error(function(err){
						alert('Error al actualizar dato,es posible que no este conectado a internet.');
					});

			$(this).remove();
	};
	
    $scope.eventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
       $.ajax({url:"/actualizarFinCurso",
				method: 'post',
				data: {
					id: event.id,
					duration: Math.abs(event.start.getHours() - event.end.getHours())
				},
				success:function(result) {
	            	//Por ahora nada
				},
				error:function(err) {
					revertFunc();
					alert('Error al actualizad dato,es posible que no este conectado a internet.');
				}
			});
    };
	
	$scope.eventRender =function (event, element) {
            //element.attr('onclick',"alert('"+event.id+"')");
			var eventVar=event;
			element.droppable({
							  drop: function( event, ui ) {
									event.title=ui.draggable.text();
									
									
									alert($(this).text()+" -> "+ui.draggable.text());},
							  accept: ".dragg-teacher"
							});
        }

    /* add custom event*/
    $scope.addEvent = function() {
      $scope.events.push({
        title: 'Open Sesame',
        start: new Date(y, m-1, d+2,9),
        end: new Date(y, m-1, d+2,12),
        className: ['openSesame']
      });
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
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
		editable: true,
		droppable: true,
		firstHour: 8,
		eventRender:$scope.eventRender,
        eventClick: $scope.eventClick,
        eventDrop: $scope.eventDrop,
        eventResize: $scope.eventResize,
		drop:$scope.drop,
		defaultView: 'agendaWeek'
      }
    };

	
	//Modelos
	$scope.courses = semesterJSON.courses ;
				
	$scope.teachers = semesterJSON.teachers ;
		 	
	//Informacion de los cursos no asignados
	$scope.infoCoursesNotAssigned=[ ];
				
				
	//Agregando cursos al calendario
	for(i=0; i<$scope.courses.length; i++) {
		for(j=0; j<$scope.courses[i].schedules.length; j++) {

			var curso = $scope.courses[i];
			var horario = curso.schedules[j];

			//Si no esta asignada a un horario o dia			
			if(horario.day == -1  || horario.hour == -1 ){
				$scope.infoCoursesNotAssigned.push({code:curso.code,duration:horario.duration,id:horario.id,color:curso.color,commission:curso.commission});
			}else{
				$scope.events.push({
									id: horario.id,
									title: curso.code+ " \n c"+curso.commission ,
									commission: curso.commission,
									start: new Date(y, m-1, d+horario.day, horario.hour, 0),
									end: new Date(y, m-1, d+horario.day, horario.hour+horario.duration, 0),
									allDay: false,
									backgroundColor: curso.color,
									borderColor: 'black'
								});
				}
			}
	}
	/* event sources array*/
    $scope.eventSources = [$scope.events];
	
	function esHorarioInvalido(hora){
	   if((hora >= 0 && hora<8) || hora>22  ){
			return true;
	   }
	   return false;
	}

}
/* EOF */