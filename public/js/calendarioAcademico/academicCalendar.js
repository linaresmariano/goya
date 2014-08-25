/**
 * calendarApp - 0.1.3
 */



app.directive('draggableCourse', function() {
			return {
				restrict: 'A',
				link: function(scope, elm, attrs) {
				//Obteniendo valor del atributo model
				var model = scope.$eval(attrs.draggModel);

				var eventObject = model;

				elm.data('eventObject', eventObject);
				var clone;
				elm.draggable({
					start: function( event, ui ) {
					
					//Creando un clon del tag teacher para draggearlo afuera del scroll
					clone=elm.clone();
					clone.css('width',elm.css('width'));
					clone.css('position','absolute');
					$('body').append(clone);
					$('body').css('cursor','pointer');
					elm.css('display','none');
					},
					zIndex: 999,
					revert: true,      
					revertDuration: 0 ,
					drag: function( event, ui ) {
						clone.css('left',elm.css('left'));
						clone.css('top',(event.pageY-15)+"px");
					},
					stop: function( event, ui ) {	
						clone.remove();
						elm.css('display','block');
						elm.draggable( 'enable' );
						$('body').css('cursor','auto');}
				});         

				}
			};
});

//Creando directive droppable con jquery ui
app.directive('draggTeacher', function() {
	return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				var clone;
				elm.draggable({
				start: function( event, ui ) {
					
					//Creando un clon del tag teacher para draggearlo afuera del scroll
					clone=elm.clone();
					clone.css('width',elm.css('width'));
					clone.css('position','absolute');
					$('body').append(clone);
					$('body').css('cursor','pointer');
					elm.css('display','none');

				},
				drag: function( event, ui ) {
					clone.css('left',elm.css('left'));
					clone.css('top',(event.pageY-15)+"px");
					//clone.css('top',150+"px");
				},
				zIndex: 999,
				revert: true,      
				revertDuration: 0 ,
				stop: function( event, ui ) {	
					clone.remove();
					elm.css('display','block');
					$('body').css('cursor','auto');}
			}); 
			}
		};
});


//Creando directive droppable con jquery ui
app.directive('draggClassRoom', function() {
	return {
			restrict: 'A',
			link: function(scope, elm, attrs) {
				//Necesita de position absolute,para droppear a los eventos del calendar
				//elm.css('position','absolute');
				var clone;
				elm.draggable({
				start: function( event, ui ) {
					clone=elm.clone();
					clone.css('width',elm.css('width'));
					clone.css('position','absolute');
					$('body').append(clone);
					$('body').css('cursor','pointer');
					elm.css('display','none');
				},
				drag: function( event, ui ) {
					clone.css('left',elm.css('left'));
					clone.css('top',(event.pageY-15)+"px");
				},
				zIndex: 999,
				revert: true,      
				revertDuration: 0 ,
				stop: function( event, ui ) {	
					clone.remove();
					elm.css('display','block');
					$('body').css('cursor','auto');}
			}); 
			}
		};
});
	
		
//Creando estilo menuTeachers,para solucionar el problema de la posicion absoluta que se requiere para dropear
app.directive('menuDraggable', function() {
	return {
			restrict: 'C',
			link: function(scope, elm, attrs) {
				var space = attrs.space;
					
				//elm.css("top",space);
				//elm.css("position","absolute");
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
       //Curso a mostrar
	   				
	   $scope.courseShow=event;
    };

     $scope.eventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       		if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			  $.ajax({url:"/updateCourse",
						method:'put',
						data: {
							id:event.id, hour:event.start.getHours(), day:event.start.getDay()
						},
						success:function(result){
                        	event.schedule.day=event.start.getDay();
							event.schedule.hour=event.start.getHours();
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
					var copiedEventObject = getModel($(this),"dragg-model");

					$http({
							url:"/updateCourse",
							method:'put',
							data: { id:copiedEventObject.schedule.id, hour:date.getHours(),day:date.getDay()}
					}).success(function(data) {
					
						//Actualizando el schedule con el nuevo horario
						copiedEventObject.schedule.day=date.getDay();
						copiedEventObject.schedule.hour=date.getHours();
						//Agragando el horario a la grilla
						$scope.addSchedule(copiedEventObject.course,copiedEventObject.schedule);
						$scope.removeScheduleNotAssigned(copiedEventObject.schedule);

					}).error(function(err){
						alert('Error al actualizar dato,es posible que no este conectado a internet.');
					});
				
			
	};
	
    $scope.eventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
       $.ajax({url:"/updateEndCourse",
				method: 'put',
				data: {
					id: event.id,
					duration: Math.abs(event.start.getHours() - event.end.getHours())
				},
				success:function(result) {
	            	event.schedule.duration=Math.abs(event.start.getHours() - event.end.getHours());
				},
				error:function(err) {
					revertFunc();
					alert('Error al actualizad dato,es posible que no este conectado a internet.');
				}
			});
    };
	
	//Cuando se dibuja los eventos
	$scope.eventRender =function (event, element) {
			//var eventVar=event;
			
			//Para abrir un dialogo
			element.attr('data-toggle','modal');
			element.attr('data-target','#myModal');
			//Para dropear un profesor o aula
			var deferred = $q.defer();
			element.droppable({
							  drop: function( eventUI, ui ) {
										//chequeo para ver si es un aula o un profesor que se dropea con
										//el curso
										classroom=getModel(ui.draggable,"ng-model");
										
										if(ui.draggable.attr('class').indexOf("dragg-class-room") !=-1){
											
											$http({
													url:"/assignedClassRoom",
													method:'put',
													data: { idClassRoom:classroom.id,idCourseSchedule:event.schedule.id,year:$scope.semester.year,semester:$scope.semester.semester}
											}).success(function(data) {
												event.schedule.semesterClassRoom=newSemesterClassRoom(classroom);
												deferred.resolve(event);
												
											}).error(function(err){
												alert("Error al asignar aula a un horario");
											});
											
										}else{
											teacher=getModel(ui.draggable,"ng-model");
											$scope.courseTeacher.teacher=newSemesterTeacher(teacher);
											$scope.courseTeacher.event=event;
											
											if(!isTeacher(event.course,$scope.courseTeacher.teacher)){
													$('#assingTeacherCourse').modal('toggle');
											}else{
											
												if(!existTeacher(event.schedule.semesterTeachers,$scope.courseTeacher.teacher)){
											
													$http({
															url:"/assignedTeacher",
															method:'put',
															data: { idTeacher:$scope.courseTeacher.teacher.id,idCourseSchedule:event.schedule.id,year:$scope.semester.year,semester:$scope.semester.semester}
													}).success(function(data) {
														
														event.schedule.semesterTeachers.push($scope.courseTeacher.teacher);
														deferred.resolve(event);

													}).error(function(err){
														alert("Error al asignar un profesor a un horario");
													});
												}else{
													alert("El profesor ya fue agregado a este horario");
												}
											}
											
											
											
										}
									},
									over: function(event, ui) {
										$(this).addClass('schedule-hover');
									},
									out: function(event, ui) {
										$(this).removeClass('schedule-hover');
									},
									accept: ".dragg-teacher , .dragg-class-room"
								});
			var promise=deferred.promise;
			promise.then(function(event) {
							//Update
							$scope.removeSchedule(event.schedule);
							$scope.addSchedule(event.course,event.schedule);
						});
        }
		
	function existTeacher(teachers,teacher){
		
		for(n=0;n < teachers.length;n++){
			if(teachers[n].id == teacher.id ){
				return true;
			}
		}
		return false;
	}
	
	function isTeacher(course,teacher){
		return existTeacher(course.semesterTeachers,teacher) || existTeacher(course.semesterInstructors,teacher);
	}
	

    //Agrega un schedule al calendario
    $scope.addSchedule = function(course,schedule) {
      	$scope.events.push({
								id: schedule.id,
								title: course.subject.code+ " \n c"+course.commission +"-" +  schedule.type
									+ (schedule.semesterClassRoom == undefined ? '' : '\n Aula '+schedule.semesterClassRoom.classRoom.number)
									+ getNamesTeachers(schedule.semesterTeachers),
								start: new Date(y, m-1, d+schedule.day, schedule.hour, 0),
								end: new Date(y, m-1, d+schedule.day, schedule.hour+schedule.duration, 0),
								allDay: false,
								backgroundColor: course.color,
								borderColor: 'black',
								//Datos necesarios del modelo
								schedule:schedule,
								course:course,
							});
    };
	
	function getModel(elm,modelName){
			return angular.element(elm).scope().$eval($(elm).attr(modelName));
	}
	
	function newSemesterClassRoom(classRoom){
			return {
						id:classRoom.id,
						description: classRoom.description,
						capacity: classRoom.capacity,
						numberOfComputers: classRoom.numberOfComputers,
						hasProyector: classRoom.hasProyector,
						classRoom:{	name: classRoom.name,
									number: classRoom.number 
									}
					}
	}
	
	function newSemesterTeacher(teacher){
			return {
						id:teacher.id,
						teacher:{	name: teacher.name,
									code: teacher.code,
									id:teacher.id
									}
					}
	}
	
	function getNamesTeachers(semesterTeachers){
		names="";
		semesterTeachers.forEach(function(semesterTeacher) {
			names+= " \n " + semesterTeacher.teacher.name;
		});
		return names;
	}
	
	$scope.createCourse=function(){
		$scope.infoCoursesNotAssigned.push($scope.events[0]);
	}
	
	//Agruega un schedule como no asignado
    $scope.addScheduleNotAssigned = function(course,schedule) {
      	$scope.infoCoursesNotAssigned.push({
								//Datos necesarios del modelo
								schedule:schedule,
								course:course,
							});
    };
    /* remove event */
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
	//Elimina el cursos seleccionado
	 $scope.remove = function(index) {
	 
		var deferred = $q.defer();
		
		$http({
			url:"/schedule/deallocateSchedule",
			method:'put',
			data: { idCourseSchedule:$scope.courseShow.schedule.id,}
		}).success(function(data) {

			
			deferred.resolve($scope.courseShow);
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addScheduleNotAssigned(event.course,event.schedule);
				});
	 

    };
	

	
	//Elimina de la lista a un schedule no asigando
	$scope.removeScheduleNotAssigned = function(schedule) {
		for(i=0;i< $scope.infoCoursesNotAssigned.length;i++){
			if($scope.infoCoursesNotAssigned[i].schedule.id == schedule.id){
				$scope.infoCoursesNotAssigned.splice(i,1);
				return;
			}
		}
    };
	
	//Elimina de la lista a un schedule asignado
	$scope.removeSchedule = function(schedule) {
		for(i=0;i< $scope.events.length;i++){
			if($scope.events[i].schedule.id == schedule.id){
				$scope.events.splice(i,1);
				return;
			}
		}
		
    };
	
		//Elimina de la lista a un schedule asignado
	$scope.assignedTeacherToCourse = function(isInCharge ) {
		var deferred = $q.defer();
		if(isInCharge == 0){
				if($scope.courseTeacher.event.course.semesterTeachers.length == 2){
					alert("Un curso solo puede tener 2 profesores a cargo como máximo");
				}else{
					$http({
						url:"/course/assignedTeacher",
						method:'put',
						data: { idTeacher:$scope.courseTeacher.teacher.id,idCourse:$scope.courseTeacher.event.course.id,year:$scope.semester.year,semester:$scope.semester.semester}
					}).success(function(data) {
															
						$scope.courseTeacher.event.course.semesterTeachers.push($scope.courseTeacher.teacher);
						deferred.resolve($scope.courseTeacher.event);
					}).error(function(err){
						alert("Error al asignar un profesor a un horario");
					});	
				}
								
		}else{
				$http({
					url:"/course/assignedInstructor",
					method:'put',
					data: { idTeacher:$scope.courseTeacher.teacher.id,idCourse:$scope.courseTeacher.event.course.id,year:$scope.semester.year,semester:$scope.semester.semester}
				}).success(function(data) {
													
					$scope.courseTeacher.event.course.semesterInstructors.push($scope.courseTeacher.teacher);
					
					deferred.resolve($scope.courseTeacher.event);
				}).error(function(err){
					alert("Error al asignar un profesor a un horario");
				});	
		}
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.course,event.schedule);
				});
		$('#assingTeacherCourse').modal('hide')
		//alert("Se debe asignar como profesor"+(isInCharge == 1 ? ' no ' : '')+ ' a cargo a este curso, y al horario');
    };
	
	$scope.deallocateClassroom=function(){
		var deferred = $q.defer();
		$http({
			url:"/schedule/deallocateClassroom",
			method:'put',
			data: { idCourseSchedule:$scope.courseShow.schedule.id}
		}).success(function(data) {
													
			$scope.courseShow.schedule.semesterClassRoom=undefined;

			deferred.resolve($scope.courseShow);
		}).error(function(err){
			alert("Error al desasignar un aula");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.course,event.schedule);
				});
	}
	
	$scope.deallocateScheduleTeacher=function(idTeacher,index){
		var deferred = $q.defer();
		$http({
			url:"/schedule/deallocateTeacher",
			method:'put',
			data: { idCourseSchedule:$scope.courseShow.schedule.id,idTeacher:idTeacher}
		}).success(function(data) {

			$scope.courseShow.schedule.semesterTeachers.splice(index, 1);
			deferred.resolve($scope.courseShow);
		}).error(function(err){
			alert("Error al desasignar un aula");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.course,event.schedule);
				});
	}
	
	$scope.deallocateCourseTeacher=function(idTeacher,index){
		var deferred = $q.defer();
		
		if(existTeacherInSchedules($scope.courseShow.course.schedules,
					$scope.courseShow.course.semesterTeachers[index])){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}
		
		$http({
			url:"/course/deallocateTeacher",
			method:'put',
			data: { idCourse:$scope.courseShow.course.id,idTeacher:idTeacher}
		}).success(function(data) {

			$scope.courseShow.course.semesterTeachers.splice(index, 1);
			deferred.resolve($scope.courseShow);
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.course,event.schedule);
				});
	}
	
	$scope.deallocateCourseInstructor=function(idTeacher,index){
		var deferred = $q.defer();
		
		if(existTeacherInSchedules($scope.courseShow.course.schedules,
					$scope.courseShow.course.semesterInstructors[index])){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}
		
		$http({
			url:"/course/deallocateInstructor",
			method:'put',
			data: { idCourse:$scope.courseShow.course.id,idTeacher:idTeacher}
		}).success(function(data) {

			$scope.courseShow.course.semesterInstructors.splice(index, 1);
			deferred.resolve($scope.courseShow);
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.course,event.schedule);
				});
	}
	
	$scope.showCoursesNotAssigned=function(index){
		$scope.courseShow=$scope.infoCoursesNotAssigned[index];
		
	}
	
	
	function existTeacherInSchedules(schedules,teacher){
		for(i=0;i<schedules.length;i++){
			if(existTeacher(schedules[i].semesterTeachers,teacher)){
				return true;
			}
		}
		return false;
	}
	

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


	
	//Modelos relacionados con la vista
	$scope.courseTeacher={};
	
	$scope.courseShow;
	
	$scope.teacherShow;
	
	//Modelos
	$scope.courses = semesterJSON.courses ;
				
	$scope.teachers = semesterJSON.teachers ;
	
	$scope.classRooms = semesterJSON.classRooms ;
	$scope.semester = { year:semesterJSON.year , semester:semesterJSON.semester };

		 	
	//Informacion de los cursos no asignados
	$scope.infoCoursesNotAssigned=[ ];
				
				
	//Agregando cursos al calendario
	for(i=0; i<$scope.courses.length; i++) {
		for(j=0; j<$scope.courses[i].schedules.length; j++) {

			var curso = $scope.courses[i];
			var horario = curso.schedules[j];

			//Si no esta asignada a un horario o dia			
			if(horario.day == -1  || horario.hour == -1 ){
				$scope.addScheduleNotAssigned(curso,horario);
			}else{
				$scope.addSchedule(curso,horario);
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