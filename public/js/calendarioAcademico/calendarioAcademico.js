
//***dependecias***//
//jquery-ui.custom.min.js
//jquery.min.js
//fullcalendar.min.js

//Dias de la semana
var Dia={
	LUNES:0,
	MARTES:1,
	MIERCOLES:2,
	JUEVES:3,
	VIERNES:4,
	SABADO:5
}


function CalendarioAcademico(idTag){
     //fecha default del calendario,para que siempre funcione para un mismo mes y año.
    var d = 26;
    var m = 0;
    var y = 1000;
	
    var calendario;
	
	//Configuracion del calendario anual como su fuera semanal
	var calendario=$('#calendar').fullCalendar({
		buttonText:{
		week: 'Semana',
		day:  'Dia'
		},
		year:1000,
		month:1,
		eventMouseover: function( event, jsEvent, view ) { },
		eventDragStop:function( event, jsEvent, ui, view ) { },
		hiddenDays: [6],
		axisFormat: 'H',
		minTime: 8,
		maxTime: 22,
		allDaySlot:false,
		slotMinutes: 30,
		snapMinutes:60,
		slotEventOverlap:false,
		dayNames:['Lunes', 'Martes', 'Miercoles', 'Jueves',
		'Viernes', 'Sabado', 'Domingo'],
		dayNamesShort:['Lun', 'Mar', 'Mie', 'Jue',
		'Vie', 'Sab', 'Dom'],
		columnFormat: {
			month: 'ddd',    // Mon
			week: 'ddd ', // Mon 9/7
			day: 'dddd '  // Monday 9/7
		},
		header: {
			left:   '',
			right: ''
		},
		editable: true,
		droppable: true, // this allows things to be dropped onto the calendar !!!
		drop: function(date, allDay) { // this function is called when something is dropped
		
				// retrieve the dropped element's stored Event Object
				var originalEventObject = $(this).data('eventObject');
				// we need to copy it, so that multiple events don't have a reference to the same object
				var copiedEventObject = $.extend({}, originalEventObject);
				// assign it the date that was reported
				copiedEventObject.start = date;
				copiedEventObject.allDay = allDay;
				// render the event on the calendar
			   // the last `true` argument determines if the event "sticks" (http://arshaw.com/fullcalendar/docs/event_rendering/renderEvent/)
			   $('#calendar').fullCalendar('renderEvent', copiedEventObject, true);
			   $(this).remove();
			
		},
		eventClick: function(calEvent, jsEvent, view) {
			//alert('Event: ' + calEvent.title);
			//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			//alert('View: ' + view.name);
			// change the border color just for fun
			//$(this).css('border-color', 'red');
			//cambiando de nombre al curso
			$('#calendar').fullCalendar( 'renderEvent', calEvent )
		},
		eventDrop :function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ){
		
		 
		  if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			  $.ajax({url:"/grilla", success:function(result){
                       //alert(result);
              }});
			}
		},
		firstHour: 8
    }).fullCalendar( 'changeView', 'agendaWeek' );          

	//Agrega un curso al calendario semanal
	this.agregarCurso=function(id,titulo,dia,hora,duracionHS,color){
		calendario.fullCalendar( 'addEventSource', [
        {
            id: id,
            title: titulo,
            start: new Date(y, m, d+dia, hora, 0),
            end: new Date(y, m, d+dia, hora+duracionHS, 0),
            allDay: false,
            backgroundColor: color
        }] )
	}
	
	
	//*********VALIDACIOENS***********//
	function esHorarioInvalido(hora){
	   if((hora >= 0 && hora<8) || hora>22  ){
			return true;
	   }
	   return false;
	}
}
