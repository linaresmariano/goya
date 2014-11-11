/**
 * calendarApp - 0.1.3
 */

//Controller principal
function CalendarCtrl($scope, $http, $q, CourseSchedule,SemesterTeacher,Semester,SemesterClassRoom){
	//Fecha por defecto para mostrar la misma semana en la grilla
    var date = new Date();
    var d = 26;
    var m = 1;
    var y = 1000;

    /* Eventos para agrgar la grilla*/
    $scope.events = [
    ];

    $scope.eventClick = function( event, allDay, jsEvent, view ){
		//Para mostrar el curso
		$scope.scheduleShow=event;
		$scope.newPatchExtras.extraDuration=$scope.scheduleShow.schedule.getExtraDuration();
		$scope.newPatchExtras.extraHour=$scope.scheduleShow.schedule.getExtraHour();
		
    };
	
	$scope.separateSchedules=function(indexCourse){
		
		$http({
				url:"/schedule/separateSchedule",
				method:'put',
				data: { idSchedule:$scope.scheduleShow.schedule.id, idCourse:$scope.scheduleShow.schedule.courses[indexCourse].id}
		}).success(function(idNewSchedule) {
				otherCourse=$scope.scheduleShow.schedule.removeCourseAndReturn(indexCourse);
				$scope.removeSchedule($scope.scheduleShow.schedule);
				$scope.addSchedule($scope.scheduleShow.schedule);
				$scope.addSchedule($scope.scheduleShow.schedule.clone(otherCourse,parseInt(idNewSchedule)));
				
		}).error(function(err){
				alert('Error al actualizar dato,es posible que no este conectado a internet.');
		});
		
	}
	
	/* Unifica horarios si es necesario,ademas retorna true si lo hace y false si no lo hace*/
	function unifySchedules(day,hour,minutes,event){
		var deferred = $q.defer();
				var schedules=$scope.semester.getSchedulesAtTheSameTime(day,hour,minutes,event.schedule);
				if(schedules.length != 0){
					schedules.push(event.schedule);
					var newSchedule=$scope.semester.unifySchedules(schedules);
					$.ajax({url:"/schedule/unify",
						method:'put',
						data: {
							schedules:JSON.parse(JSON.stringify(schedules))
						},
						success:function(result){
							event.schedule.update(day,hour,minutes);
							deferred.resolve(event.schedule);
						},
						error:function(err){
							revertFunc();
							alert('Error al unificar horarios');
						}
					});
					//Refresh calendario
					var promise=deferred.promise;
					promise.then(function(schedule) {
						//Update
						$scope.removeSchedule(schedules[0]);
						$scope.addSchedule(schedules[0]);
						for(k=1;k < schedules.length;k++){
								$scope.removeSchedule(schedules[k]);

						}
						
					});
					return true;
				}else{
					return false;
				}
	}
	
    $scope.eventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       		if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			
				seconds=Math.abs(minuteDelta+event.schedule.minutes + (event.schedule.hour * 60) )*60;
				hour=Math.abs(parseInt(seconds/3600));
				minutes=Math.abs(parseInt((seconds-(3600*hour))/60));
				
				if(unifySchedules(event.start.getDay(),hour,minutes,event)){
					$scope.removeScheduleNotAssigned(event.schedule);
					return;
				}
				
				$.ajax({url:"/updateCourse",
						method:'put',
						data: {
							id:event.id, hour:hour, day:event.start.getDay(),
							minutes:minutes
						},
						success:function(data){
							if(data.error){
								$scope.error=data.error;
								revertFunc();
								$('#errorNotify').modal('toggle');
							}else{
								event.schedule.update(event.start.getDay(),hour,minutes);
							}
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
				
				
				seconds=Math.abs(date.getMinutes() + (date.getHours() * 60) - ((getMinutes(copiedEventObject.schedule.getExtraHour()) +(getHour(copiedEventObject.schedule.getExtraHour())*60)) || 0))*60;
				hour=Math.abs(parseInt(seconds/3600));
				minutes=Math.abs(parseInt((seconds-(3600*hour))/60));
				if(unifySchedules(date.getDay(),hour,minutes,copiedEventObject)){
					$scope.removeScheduleNotAssigned(copiedEventObject.schedule);
					return;
				}

				$http({
							url:"/updateCourse",
							method:'put',
							data: { id:copiedEventObject.schedule.id, hour:hour,day:date.getDay(),
							minutes:minutes}
				}).success(function(data) {
						if(data.error){
								$scope.error=data.error;
								$('#errorNotify').modal('toggle');
					}else{
							//Actualizando el schedule con el nuevo horario
							copiedEventObject.schedule.update(date.getDay(),hour,minutes);
							//Agragando el horario a la grilla
							$scope.addSchedule(copiedEventObject.schedule);
							$scope.removeScheduleNotAssigned(copiedEventObject.schedule);
					}
				}).error(function(err){
						alert('Error al actualizar dato,es posible que no este conectado a internet.');
				});	
	};
	
    $scope.eventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
	
		seconds=Math.abs(minuteDelta+event.schedule.durationMinutes + (event.schedule.durationHour * 60) )*60;
		hourDuration=Math.abs(parseInt(seconds/3600));
		minutesDuration=Math.abs(parseInt((seconds-(3600*hourDuration))/60));	
		
       $.ajax({url:"/updateEndCourse",
				method: 'put',
				data: {
					id: event.id,
					durationHour:hourDuration,
					durationMinutes: minutesDuration
				},
				success:function(data) {
						if(data.error){
							$scope.error=data.error;
							$('#errorNotify').modal('toggle');
							revertFunc();
						}else{
							event.schedule.updateDuration(hourDuration,minutesDuration);
						}
				},
				error:function(err) {
					revertFunc();
					alert('Error al actualizad dato,es posible que no este conectado a internet.');
				}
			});
    };
	
	//Cuando se dibuja los eventos
	$scope.eventRender =function (event, element) {
			//Para abrir un dialogo
			element.attr('data-toggle','modal');
			element.attr('data-target','#myModal');
			
			//Para las validaciones que se muestran en los header
			checkAll(event.schedule,element);
			
			if(!event.schedule.patch.visibility){
				element.addClass('hideToPrint');
			}

			//Para dropear un profesor o aula
			var deferred = $q.defer();
			element.droppable({
							  drop: function( eventUI, ui ) {
										//chequeo para ver si es un aula o un profesor que se dropea con
										//el curso
										classroom=getModel(ui.draggable,"ng-model");
										
										if(ui.draggable.attr('class').indexOf("dragg-class-room") !=-1){
											assignedClassRoom(classroom,event,deferred);
										}else{
											teacher = getModel(ui.draggable,"ng-model");
											assignedSemesterTeacher(teacher,event);
										}
										$(this).removeClass('schedule-hover');
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
							$scope.addSchedule(event.schedule);
						});
    }
	
	function assignedSemesterTeacher(teacher,event){
			$scope.courseTeacher.teacher = new SemesterTeacher(teacher.newSemesterTeacher());
			$scope.courseTeacher.teacher.teacher=teacher;
			$scope.courseTeacher.event = event;

			if(!$scope.courseTeacher.teacher.existSemesterTeacher(event.schedule.semesterTeachers)) {
				if(!$scope.courseTeacher.teacher.isTeacherOfCourses(event.schedule.courses)) {
					$('#assingTeacherCourse').modal('toggle');
				}else{
					$scope.assignedTeacherToSchedule();
				}
			}else{
				alert("El profesor ya fue agregado a este horario");
			}
	}
	
	function assignedClassRoom(classroom,event,deferred){
		$http({
			url:"/assignedClassRoom",
			method:'put',
			data: { idClassRoom:classroom.id,idCourseSchedule:event.schedule.id,year:$scope.semester.year,semester:$scope.semester.semester}
		}).success(function(data) {
			if(data.error){
				$scope.error=data.error;
				$('#errorNotify').modal('toggle');
			}else{
					event.schedule.semesterClassRoom=new SemesterClassRoom(classroom.newSemesterClassRoom());
					deferred.resolve(event);
			}	
		}).error(function(err){
			alert("Error al asignar aula a un horario");
		});
	}
	
	function getMinutes(floatNumber){
		sign=floatNumber >= 0 ? 1 : -1 ;
		return (floatNumber+"").split(".").length == 1 ? 0 : ((floatNumber+"").split(".")[1]-2)*10*sign;
	}
	
	function getHour(floatNumber){
		return parseInt(floatNumber) ;
	}

    //Agrega un schedule al calendario
    $scope.addSchedule = function(schedule) {
	
		extraHour=getHour(schedule.patch.extraHour);
		extraMinutes=getMinutes(schedule.patch.extraHour);
		
		extraHourDuration=getHour(schedule.patch.extraDuration);
		extraMinutesDuration=getMinutes(schedule.patch.extraDuration);
      	$scope.events.push({
								id: schedule.id,
								title:schedule.getTitle(),
								start: new Date(y, m-1, d+schedule.day, schedule.hour+extraHour,schedule.minutes+extraMinutes),
								end: new Date(y, m-1, d+schedule.day, schedule.hour+schedule.durationHour+extraHour+extraHourDuration, schedule.minutes+schedule.durationMinutes+extraMinutes+extraMinutesDuration),
								allDay: false,
								backgroundColor: schedule.courses[0].color,
								borderColor: 'black',
								//Datos necesarios del modelo
								schedule:schedule
							});
    };
	
	function getModel(elm,modelName){
			return angular.element(elm).scope().$eval($(elm).attr(modelName));
	}
	
	$scope.createCourse=function(){
		$scope.infoCoursesNotAssigned.push($scope.events[0]);
	}
	
	//Agrega un schedule como no asignado
    $scope.addScheduleNotAssigned = function(schedule) {
      	$scope.infoCoursesNotAssigned.push({
								//Datos necesarios del modelo
								schedule:schedule
							});
    };
    //Elimina un evento
    $scope.remove = function(index) {
      $scope.events.splice(index,1);
    };
	//Elimina el cursos seleccionado
	 $scope.remove = function(index) {
	 
		var deferred = $q.defer();
		
		$http({
			url:"/schedule/deallocateSchedule",
			method:'put',
			data: { idCourseSchedule:$scope.scheduleShow.schedule.id,}
		}).success(function(data) {

			deferred.resolve($scope.scheduleShow);
			$('#myModal').modal('hide');
			
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addScheduleNotAssigned(event.schedule);
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
	$scope.assignedTeacherToCourse = function(isInCharge) {
		var deferred = $q.defer();

		var event = $scope.courseTeacher.event;
		var schedule = event.schedule;

		var dataTeacher = {
			idTeacher: $scope.courseTeacher.teacher.id,
			idCourse: schedule.courses,
			year: $scope.semester.year,
			semester: $scope.semester.semester
		};


		if(isInCharge == 0) {
			if(schedule.getTeachers().length == 2){
				alert("Un curso solo puede tener 2 profesores a cargo como máximo");
			}else{
				$http({
					url:"/course/assignedTeacher",
					method:'put',
					data: dataTeacher
				}).success(function(data) {
				
					schedule.addSemesterTeacherToCourses($scope.courseTeacher.teacher);
					$scope.courseTeacher.teacher.teacher.hasCurrentSemesterTeachers=true;

					deferred.resolve(event);
				}).error(function(err){
					alert("Error al asignar un profesor a un horario");
				});
			}
		
		} else if(isInCharge == 1) {

			$http({
				url:"/course/assignedInstructor",
				method:'put',
				data: dataTeacher
			}).success(function(data) {
									
				schedule.addSemesterInstructorToCourses($scope.courseTeacher.teacher);
				$scope.courseTeacher.teacher.teacher.hasCurrentSemesterTeachers=true;
				
				deferred.resolve(event);
			}).error(function(err){
				alert("Error al asignar un profesor a un horario");
			});

		}
		// Siempre asignamos como profesor del horario
		$scope.assignedTeacherToSchedule();
		// Hide modal
		$('#assingTeacherCourse').modal('hide');
		
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
			//Update
			$scope.removeSchedule(schedule);
			$scope.addSchedule(schedule);
		});
	};
	
	$scope.assignedTeacherToSchedule=function(){
		var deferred = $q.defer();
		var event = $scope.courseTeacher.event;
		var schedule = event.schedule;
		$http({
			url: "/schedule/assignedTeacher",
			method: 'put',
			data: {
				idTeacher: $scope.courseTeacher.teacher.id,
				idCourseSchedule: schedule.id,
				year: $scope.semester.year,
				semester: $scope.semester.semester
			}
		}).success(function(data) {

				schedule.semesterTeachers.push($scope.courseTeacher.teacher);
				deferred.resolve(event);

		}).error(function(err){
			alert("Error al asignar un profesor a un horario");
		});
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
			//Update
			$scope.removeSchedule(schedule);
			$scope.addSchedule(schedule);
		});
	}
	
	$scope.deallocateClassroom=function(){
		var deferred = $q.defer();
		$http({
			url:"/schedule/deallocateClassroom",
			method:'put',
			data: { idCourseSchedule:$scope.scheduleShow.schedule.id}
		}).success(function(data) {
													
			$scope.scheduleShow.schedule.semesterClassRoom=undefined;

			deferred.resolve($scope.scheduleShow);
		}).error(function(err){
			alert("Error al desasignar un aula");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.schedule);
				});
	}
	
	$scope.deallocateScheduleTeacher=function(idTeacher,index){
		var deferred = $q.defer();
		$http({
			url:"/schedule/deallocateTeacher",
			method:'put',
			data: { idCourseSchedule:$scope.scheduleShow.schedule.id,idTeacher:idTeacher}
		}).success(function(data) {

			$scope.scheduleShow.schedule.semesterTeachers.splice(index, 1);
			deferred.resolve($scope.scheduleShow);
		}).error(function(err){
			alert("Error al desasignar un aula");
		});	
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.schedule);
				});
	}
	
	$scope.deallocateCourseTeacher=function(idTeacher,semesterTeacher){
		if(semesterTeacher.existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,$scope.events)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}
		var deferred = $q.defer();
		$http({
			url:"/course/deallocateTeacher",
			method:'put',
			data: { courses:$scope.scheduleShow.schedule.courses,idTeacher:idTeacher}
		}).success(function(data) {
			
			$scope.scheduleShow.schedule.deallocateTeacherOfCourses(idTeacher);
			$scope.semester.getTeacherOfList(semesterTeacher.teacher).hasCurrentSemesterTeachers=$scope.semester.isAssignedTeacher(semesterTeacher.teacher) || $scope.semester.isAssignedInstructor(semesterTeacher.teacher);
			
			deferred.resolve($scope.scheduleShow);
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
		
		var promise=deferred.promise;
		promise.then(function(event) {
						//Update
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.schedule);
				});

	}
	
	$scope.deallocateCourseInstructor=function(idTeacher,semesterTeacher){
		if(semesterTeacher.existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,$scope.events)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}
		$http({
			url:"/course/deallocateInstructor",
			method:'put',
			data: { idCourse:JSON.parse(JSON.stringify($scope.scheduleShow.schedule.courses)),idTeacher:idTeacher}
		}).success(function(data) {
			$scope.scheduleShow.schedule.deallocateInstructorOfCourses(idTeacher);
			$scope.semester.getTeacherOfList(semesterTeacher.teacher).hasCurrentSemesterTeachers=$scope.semester.isAssignedInstructor(semesterTeacher.teacher) || $scope.semester.isAssignedTeacher(semesterTeacher.teacher);
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	
	}
	
	$scope.showCoursesNotAssigned=function(index){
		$scope.scheduleShow=$scope.infoCoursesNotAssigned[index];
		$scope.newPatchExtras.extraDuration=$scope.scheduleShow.schedule.patch.extraDuration;
		$scope.newPatchExtras.extraHour=$scope.scheduleShow.schedule.patch.extraHour;
	}

	$scope.hasSchedule = function() {
		return $scope.infoCoursesNotAssigned.indexOf($scope.scheduleShow) < 0;
	}

	$scope.hasClassroom = function() {
		return $scope.scheduleShow != undefined &&
			$scope.scheduleShow.schedule != undefined &&
			$scope.scheduleShow.schedule.semesterClassRoom != undefined;
	}
	
	$scope.hideTeacher=function(teacher){
		var deferred = $q.defer();
		if(!teacher.existTeacher($scope.scheduleShow.schedule.getNoVisibleTeachers())){

			$http({
				url:"/patch/teacherHide",
				method:'put',
				data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id}
			}).success(function(data) {
				$scope.scheduleShow.schedule.addNoVisibleTeacher(teacher);
				deferred.resolve();
				
			}).error(function(err){
				alert("Error al desasignar un profesor");
			});	
		
		}else{

			$http({
				url:"/patch/teacherVisible",
				method:'put',
				data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id}
			}).success(function(data) {
				$scope.scheduleShow.schedule.removeNoVisibleTeacher(teacher);
				deferred.resolve();
						
			}).error(function(err){
				alert("Error al desasignar un profesor");
			});	

		}
		
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function() {
					$scope.removeSchedule($scope.scheduleShow.schedule);
					$scope.addSchedule($scope.scheduleShow.schedule);
				});

	}
	
	$scope.isHideTeacher=function(teacher){
		return teacher.existTeacher($scope.scheduleShow.schedule.patch.noVisibleTeachers);
	}
	
	$scope.newPatchExtras={};
	
	$scope.updatePatch = function() {
		var deferred = $q.defer();
		$http({
			url:"/patch/update",
			method:'put',
			data: { extraHour:$scope.newPatchExtras.extraHour, extraDuration: $scope.newPatchExtras.extraDuration,idPatch:$scope.scheduleShow.schedule.patch.id}
		}).success(function(data) {
			$scope.scheduleShow.schedule.setExtraDuration($scope.newPatchExtras.extraDuration);
			$scope.scheduleShow.schedule.setExtraHour($scope.newPatchExtras.extraHour);
			deferred.resolve();
			$('#myModal').modal('hide')
		}).error(function(err){
			alert("Error al actualizar horario");
		})
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function() {
					$scope.removeSchedule($scope.scheduleShow.schedule);
					$scope.addSchedule($scope.scheduleShow.schedule);
				});
	}
	
	$scope.hideSchedule=function(){
		var deferred = $q.defer();
		$http({
				url:"/patch/updateVisibility",
				method:'put',
				data: { idPatch:$scope.scheduleShow.schedule.patch.id, visibility:!$scope.scheduleShow.schedule.patch.visibility}
			}).success(function(data) {
					
				//Actualizando el patch con la nueva cisibilidad
				$scope.scheduleShow.schedule.patch.visibility=!$scope.scheduleShow.schedule.patch.visibility;
				deferred.resolve($scope.scheduleShow.schedule);

			}).error(function(err){
					alert('Error al ocultar un horario');
		});
		
		var promise=deferred.promise;
		promise.then(function(schedule) {
							//Update
							$scope.removeSchedule(schedule);
							$scope.addSchedule(schedule);
				});
	}

    /* Configuracion de la grilla */
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
		snapMinutes:30,
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
	
    $scope.hasCurrentSemesterTeachers=function(teacher){
		return teacher.hasCurrentSemesterTeachers($scope.semester.year,$scope.semester.semester);
    }
    
    function hasCourses(semesterTeacher){
        return  semesterTeacher.teacherCourses.length != 0  ||  semesterTeacher.instructorCourses.length != 0;
    }


	
	//Modelos relacionados con la vista
	$scope.courseTeacher={};
	
	$scope.scheduleShow;
	
	$scope.teacherShow;
	
	$scope.error;
	
		 	
	//Informacion de los cursos no asignados
	$scope.infoCoursesNotAssigned=[ ];
				
	$scope.semester=new Semester({assignedSchedules:[],
						schedulesAreNotAssigned:[],
						year:semesterJSON.year , 
						semester:semesterJSON.semester,
						teachers:semesterJSON.teachers,
						classRooms:semesterJSON.classRooms },semesterJSON.courses);
						
	$scope.semester.schedulesAreNotAssigned.forEach(function(schedule) {
		$scope.addScheduleNotAssigned(schedule);
	});

	$scope.semester.assignedSchedules.forEach(function(schedule) {
		$scope.addSchedule(schedule);
	});
	

	/* event sources array*/
    $scope.eventSources = [$scope.events];
	
	function esHorarioInvalido(hora){
	   if((hora >= 0 && hora<8) || hora>22  ){
			return true;
	   }
	   return false;
	}
	
	//Funciones para las validaciones
	var messages=[];
	var typeMessage={ok:0,danger:1,warning:2};
	
	function checkAmountTeachers(schedule,element,message){
		if(schedule.getTeachers().length == 0){
			messages[schedule.id]=messages[schedule.id]+'* Este curso no tiene profesores\n'
			$(element).find('.fc-event-time').css('background','#E70000');
			$(element).find('.fc-event-time').css('opacity','1');
			$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
			return typeMessage.danger;
		}else if(schedule.semesterTeachers.length == 0){
			messages[schedule.id]=messages[schedule.id]+'* Este horario no tiene profesores\n';
			$(element).find('.fc-event-time').css('background','yellow');
			$(element).find('.fc-event-time').css('opacity','1');
			$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
			return typeMessage.warning;
		}
		return typeMessage.ok;
	}
	
	function amountEnrolled(courses){
		amount=0;
		courses.forEach(function(course) {
			amount+=course.enrolled;
		});
		return amount;
	}
	
	function amountCapacity(courses){
		amount=0;
		courses.forEach(function(course) {
			amount+=course.capacity;
		});
		return amount;
	}
	
	function checkAmountEnrolled(schedule,element){
		if(amountEnrolled(schedule.courses) < 5){
			messages[schedule.id]=messages[schedule.id]+'* La cantidad de inscriptos es menor a 5 \n';
			$(element).find('.fc-event-time').css('background','#E70000');
			$(element).find('.fc-event-time').css('opacity','1');
			$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
			return typeMessage.danger;
		}else if(amountEnrolled(schedule.courses) < 15){
			messages[schedule.id]=messages[schedule.id]+'* La cantidad de inscriptos es menor a 15 \n';
			$(element).find('.fc-event-time').css('background','yellow');
			$(element).find('.fc-event-time').css('opacity','1');
			$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
			return typeMessage.warning;

		} else if(amountEnrolled(schedule.courses) > amountCapacity(schedule.courses)) {
			messages[schedule.id]+='* La cantidad de inscriptos supera el cupo \n';
			$(element).find('.fc-event-time').css('background', '#E70000');
			$(element).find('.fc-event-time').css('opacity', '1');
			$(element).find('.fc-event-time').attr('title', messages[schedule.id]);
			return typeMessage.danger;
		}

		return typeMessage.ok;
	}
	
	function checkPercentageEnrolled(schedule,element){
		//Si no tiene aula ok
		if(!schedule.semesterClassRoom)return typeMessage.ok;

		var courseCapacity = amountCapacity(schedule.courses);
		var classroomCapacity = schedule.semesterClassRoom.capacity;

		if(courseCapacity < (classroomCapacity/2)){
			messages[schedule.id]=messages[schedule.id]+'* La cantidad de cupos ('+courseCapacity+') es mucho menor a la capacidad del aula ('+classroomCapacity+') \n';
			$(element).find('.fc-event-time').css('background','yellow');
			$(element).find('.fc-event-time').css('opacity','1');
			$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
			return typeMessage.warning;
		} else if(courseCapacity > classroomCapacity) {
			messages[schedule.id]+='* La cantidad de cupos ('+courseCapacity+') no entra en la capacidad del aula asignada ('+classroomCapacity+') \n';
			$(element).find('.fc-event-time').css('background', 'yellow');
			$(element).find('.fc-event-time').css('opacity', '1');
			$(element).find('.fc-event-time').attr('title', messages[schedule.id]);
			return typeMessage.warning;
		}
		return typeMessage.ok;
	}
	
	function checkAll(schedule,element){
		messages[schedule.id]='';
		results=[];
		
		results.push(checkAmountEnrolled(schedule,element));
		results.push(checkAmountTeachers(schedule,element));
		results.push(checkPercentageEnrolled(schedule,element));
		
		results.forEach(function(result) {
			if(result == typeMessage.danger){
				$(element).find('.fc-event-time').css('background','#E70000');
				$(element).find('.fc-event-time').css('opacity','1');
				return;
			}
		});
		
		allResults=true;
		results.forEach(function(result) {
			allResults&=result == typeMessage.ok;
			
		});
		
		if(allResults){
			checkOK(element);
		}
		
	}
	
	function checkOK(element){
		$(element).find('.fc-event-time').css('background','black');
		$(element).find('.fc-event-time').css('opacity','0.3');
	}
}
/* EOF */