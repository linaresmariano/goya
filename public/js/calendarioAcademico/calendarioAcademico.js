
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
		handleWindowResize :false,
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
				copiedEventObject.end = new Date(date.getYear(),date.getDay(),date.getHours()+2,0);
				copiedEventObject.allDay = allDay;
				
				
				 $.ajax({url:"/actualizarCurso",
						method:'post',
						data: { id:copiedEventObject.id, hora:date.getHours(),dia:date.getDay()} ,success:function(result){
							
							//Si pudo guardar el horario del curso por ajax,entonces lo dibuja
							$('#calendar').fullCalendar('addEventSource', [{ id: copiedEventObject.id,
																title: copiedEventObject.title,
																start: new Date(y, m, date.getDay()+d,date.getHours(), 0),
																end: new Date(y, m, date.getDay()+d, (date.getHours()+copiedEventObject.duracion), 0),
																allDay: false,
																backgroundColor: copiedEventObject.color}]);
							
						
						},error:function(err){
							alert('Error al actualizad dato,es posible que no este conectado a internet.');
						}
					});
				
			    $(this).remove();

			
		},
		eventResize :function( event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){ 
		  $.ajax({url:"/actualizarFinCurso",
						method:'post',
						data: { id:event.id,duracion:Math.abs(event.start.getHours()- event.end.getHours())} ,success:function(result){
                        //Por ahora nada
						},error:function(err){
							revertFunc();
							alert('Error al actualizad dato,es posible que no este conectado a internet.');
						}
					});
		},
		eventClick: function(calEvent, jsEvent, view) {
			//alert('Event: ' + calEvent.title);
			//alert('Coordinates: ' + jsEvent.pageX + ',' + jsEvent.pageY);
			//alert('View: ' + view.name);
			// change the border color just for fun
			//$(this).css('border-color', 'red');
			//cambiando de nombre al curso
			$('#calendar').fullCalendar( 'renderEvent', calEvent )
			
			$.ajax({url:"cursos/"+calEvent.title+"/"+calEvent.comision,
				method:'get',
				data: {},
					success:function(result){
            
            $("#curso_html").html(result);
            
            $('#myModalCurso').modal('show');
        
				},error:function(err){}
			});
		},
		eventDrop :function( event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view ){
		
		 
		  if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			  $.ajax({url:"/actualizarCurso",
						method:'post',
						data: { id:event.id, hora:event.start.getHours(),dia:event.start.getDay()} ,success:function(result){
                        //Por ahora nada
						},error:function(err){
							revertFunc();
							alert('Error al actualizad dato,es posible que no este conectado a internet.');
						}
					});
			}
		},
		firstHour: 8
    }).fullCalendar( 'changeView', 'agendaWeek' );          

	//Agrega un curso al calendario semanal
	this.agregarCurso=function(id,titulo,comision,dia,hora,duracionHS,color){
		calendario.fullCalendar( 'addEventSource', [
        {
            id: id,
            title: titulo,
            comision: comision,
            start: new Date(y, m, d+dia, hora, 0),
            end: new Date(y, m, d+dia, hora+duracionHS, 0),
            allDay: false,
            backgroundColor: color
        }] )
	}
	
	//Elimina un curso al calendario semanal
	this.eliminarCurso=function(id){
		calendario.fullCalendar( 'removeEvents' , id );
	}
	
	
	//*********VALIDACIOENS***********//
	function esHorarioInvalido(hora){
	   if((hora >= 0 && hora<8) || hora>22  ){
			return true;
	   }
	   return false;
	}
}
