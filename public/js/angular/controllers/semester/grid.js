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
	//Hace una peticion ajax
	function sendData(info){
		$http({url:info.url,
				method:'put',
						data: info.data}).
						success(function(data){
							if(data.error){
								$scope.error=data.error;
								if(info.revertFunc)
									info.revertFunc();
								$('#errorNotify').modal('toggle');
							}else{
								info.success(data);
							}
						}).
						error(function(err){
							if(info.revertFunc)
								revertFunc();
							alert('Error al conectarse con el servidor');
					})
	}
	//Para manejar el evento click sobre un evento de la grilla
    $scope.eventClick = function( event, allDay, jsEvent, view ){
		//Para mostrar el curso
		$scope.scheduleShow=event;
		$scope.newPatchExtras.extraDuration=$scope.scheduleShow.schedule.getExtraDuration();
		$scope.newPatchExtras.extraHour=$scope.scheduleShow.schedule.getExtraHour();
		
    };
	//Separa un horario que pertenezca a dos cursos
	$scope.separateSchedules=function(indexCourse){
		sendData({	url:"/schedule/separateSchedule",
					data: { idSchedule:$scope.scheduleShow.schedule.id, idCourse:$scope.scheduleShow.schedule.courses[indexCourse].id},
					success:function(idNewSchedule){
						otherCourse=$scope.scheduleShow.schedule.removeCourseAndReturn(indexCourse);
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule.clone(otherCourse,parseInt(idNewSchedule)));
					}});
	}
	
	// Unifica horarios si es necesario,ademas retorna true si lo hace y false si no lo hace*
	function unifySchedules(day,hour,minutes,event){
				var schedules=$scope.semester.getSchedulesAtTheSameTime(day,hour,minutes,event.schedule);
				if(schedules.length != 0){
					schedules.push(event.schedule);
					var newSchedule=$scope.semester.unifySchedules(schedules);
					sendData({	url:"/schedule/unify",
									data: {schedules:JSON.parse(JSON.stringify(schedules))},
									success:function(data){
										event.schedule.update(day,hour,minutes);
										$scope.removeSchedule(schedules[0]);
										$scope.addSchedule(schedules[0]);
										for(k=1;k < schedules.length;k++){
												$scope.removeSchedule(schedules[k]);
										}
								}})
					return true;
				}else{
					return false;
				}
	}
	//Para manejar el evento que agrega un horario a la grilla
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
					
				sendData({url:"/updateCourse",
							data: {
							id:event.id, hour:hour, day:event.start.getDay(),minutes:minutes},
							revertFunc:revertFunc,
							success:function(data){
								event.schedule.update(event.start.getDay(),hour,minutes);
							}});
			}
    };
	//Para manejar el cambio de un horario en la grilla
	$scope.drop= function(date, allDay) { 
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
				sendData({	url:"/updateCourse",
							data: { id:copiedEventObject.schedule.id, hour:hour,day:date.getDay(),minutes:minutes},
							success:function(data){
								copiedEventObject.schedule.update(date.getDay(),hour,minutes);
								$scope.addSchedule(copiedEventObject.schedule);
								$scope.removeScheduleNotAssigned(copiedEventObject.schedule);
							}});
	};
	
    $scope.eventResize = function(event, dayDelta, minuteDelta, revertFunc, jsEvent, ui, view ){
	
		seconds=Math.abs(minuteDelta+event.schedule.durationMinutes + (event.schedule.durationHour * 60) )*60;
		hourDuration=Math.abs(parseInt(seconds/3600));
		minutesDuration=Math.abs(parseInt((seconds-(3600*hourDuration))/60));	
		
		sendData({url:"/updateEndCourse",
				data: {id: event.id,durationHour:hourDuration,durationMinutes: minutesDuration},
				revertFunc:revertFunc,
				success:function(data){
					event.schedule.updateDuration(hourDuration,minutesDuration);
				}});
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
			element.droppable({	drop: function( eventUI, ui ) {
										//chequeo para ver si es un aula o un profesor que se dropea con
										//el curso
										classroom=getModel(ui.draggable,"ng-model");
										
										if(ui.draggable.attr('class').indexOf("dragg-class-room") !=-1){
											assignedClassRoom(classroom,event);
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
	
	function assignedClassRoom(classroom,event){
		sendData({	url:"/assignedClassRoom",
					data: { idClassRoom:classroom.id,idCourseSchedule:event.schedule.id,year:$scope.semester.year,semester:$scope.semester.semester},
					success:function(data){
						event.schedule.semesterClassRoom=new SemesterClassRoom(classroom.newSemesterClassRoom());
						$scope.removeSchedule(event.schedule);
						$scope.addSchedule(event.schedule);
					}});
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
		sendData({	url:"/schedule/deallocateSchedule",
					data: { idCourseSchedule:$scope.scheduleShow.schedule.id,},
					success:function(data){
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addScheduleNotAssigned($scope.scheduleShow.schedule);
						$('#myModal').modal('hide');
					}});
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
				sendData({	url:"/course/assignedTeacher",
							data: dataTeacher,
							success:function(){
								schedule.addSemesterTeacherToCourses($scope.courseTeacher.teacher);
								$scope.courseTeacher.teacher.teacher.hasCurrentSemesterTeachers=true;
								$scope.removeSchedule(schedule);
								$scope.addSchedule(schedule);
							}});
			}
		} else if(isInCharge == 1) {
			sendData({	url:"/course/assignedInstructor",
						data: dataTeacher,
						success:function(data){
							schedule.addSemesterInstructorToCourses($scope.courseTeacher.teacher);
							$scope.courseTeacher.teacher.teacher.hasCurrentSemesterTeachers=true;
							$scope.removeSchedule(schedule);
							$scope.addSchedule(schedule);
						}});
		}
		// Siempre asignamos como profesor del horario
		$scope.assignedTeacherToSchedule();
		// Hide modal
		$('#assingTeacherCourse').modal('hide');
	};
	
	$scope.assignedTeacherToSchedule=function(){
		var event = $scope.courseTeacher.event;
		var schedule = event.schedule;
		sendData({	url: "/schedule/assignedTeacher",
					data: {idTeacher: $scope.courseTeacher.teacher.id,idCourseSchedule: schedule.id,
							year: $scope.semester.year,semester: $scope.semester.semester},
					success:function(data){
						schedule.semesterTeachers.push($scope.courseTeacher.teacher);
						$scope.removeSchedule(schedule);
						$scope.addSchedule(schedule);
					}});
	}
	
	$scope.deallocateClassroom=function(){
		sendData({url:"/schedule/deallocateClassroom",
			data: { idCourseSchedule:$scope.scheduleShow.schedule.id},
			success:function(data){
				$scope.scheduleShow.schedule.semesterClassRoom=undefined;
				$scope.removeSchedule($scope.scheduleShow.schedule);
				$scope.addSchedule($scope.scheduleShow.schedule);
			}});
	}
	
	$scope.deallocateScheduleTeacher=function(idTeacher,index){
		sendData({	url:"/schedule/deallocateTeacher",
					data: { idCourseSchedule:$scope.scheduleShow.schedule.id,idTeacher:idTeacher},
					success:function(data){
						$scope.scheduleShow.schedule.semesterSemesterTeacher(index);
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule);
					}});
	}
	
	$scope.deallocateCourseTeacher=function(idTeacher,semesterTeacher){
		if(semesterTeacher.existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,$scope.events)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}
		sendData({	url:"/course/deallocateTeacher",
					data: { courses:$scope.scheduleShow.schedule.courses,idTeacher:idTeacher},
					success:function(){
						$scope.scheduleShow.schedule.deallocateTeacherOfCourses(idTeacher);
						$scope.semester.getTeacherOfList(semesterTeacher.teacher).hasCurrentSemesterTeachers=$scope.semester.isAssignedTeacher(semesterTeacher.teacher) || $scope.semester.isAssignedInstructor(semesterTeacher.teacher);
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule);
					}});
	}
	
	$scope.deallocateCourseInstructor=function(idTeacher,semesterTeacher){
		if(semesterTeacher.existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,$scope.events)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}	
		sendData({	url:"/course/deallocateInstructor",
					data: { idCourse:JSON.parse(JSON.stringify($scope.scheduleShow.schedule.courses)),idTeacher:idTeacher},
					success:function(){
						$scope.scheduleShow.schedule.deallocateInstructorOfCourses(idTeacher);
						$scope.semester.getTeacherOfList(semesterTeacher.teacher).hasCurrentSemesterTeachers=$scope.semester.isAssignedInstructor(semesterTeacher.teacher) || $scope.semester.isAssignedTeacher(semesterTeacher.teacher);
					}});
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
		if(!teacher.existTeacher($scope.scheduleShow.schedule.getNoVisibleTeachers())){
			sendData({	url:"/patch/teacherHide",
						data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id},
						success:function(data){
							$scope.scheduleShow.schedule.addNoVisibleTeacher(teacher);
							$scope.removeSchedule($scope.scheduleShow.schedule);
							$scope.addSchedule($scope.scheduleShow.schedule);
						}});
		}else{	
			sendData({	url:"/patch/teacherVisible",
						data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id},
						success:function(){
							$scope.scheduleShow.schedule.removeNoVisibleTeacher(teacher);
							$scope.removeSchedule($scope.scheduleShow.schedule);
							$scope.addSchedule($scope.scheduleShow.schedule);
						}});
		}
	}
	
	$scope.isHideTeacher=function(teacher){
		return teacher.existTeacher($scope.scheduleShow.schedule.patch.noVisibleTeachers);
	}
	
	$scope.newPatchExtras={};
	
	$scope.updatePatch = function() {
		sendData({	url:"/patch/update",
					data: { extraHour:$scope.newPatchExtras.extraHour, extraDuration: $scope.newPatchExtras.extraDuration,idPatch:$scope.scheduleShow.schedule.patch.id},
					success:function(data){
						$scope.scheduleShow.schedule.setExtraDuration($scope.newPatchExtras.extraDuration);
						$scope.scheduleShow.schedule.setExtraHour($scope.newPatchExtras.extraHour);
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule);
						$('#myModal').modal('hide')
					}});
	}
	
	$scope.hideSchedule=function(){
		sendData({	url:"/patch/updateVisibility",
					data: { idPatch:$scope.scheduleShow.schedule.patch.id, visibility:!$scope.scheduleShow.schedule.patch.visibility},
					success:function(data){
						$scope.scheduleShow.schedule.changeVisibility();
						$scope.removeSchedule($scope.scheduleShow.schedule);
						$scope.addSchedule($scope.scheduleShow.schedule);	
					}
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
	
	function markError(element,schedule){
		$(element).find('.fc-event-time').css('background','#E70000');
		$(element).find('.fc-event-time').css('opacity','1');
		$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
	}
	
	function markWarning(element,schedule){
		$(element).find('.fc-event-time').css('background','yellow');
		$(element).find('.fc-event-time').css('opacity','1');
		$(element).find('.fc-event-time').attr('title',messages[schedule.id]);
	}

	function markOk(element){
		$(element).find('.fc-event-time').css('background','black');
		$(element).find('.fc-event-time').css('opacity','0.3');
	}
	
	function checkAmountEnrolled(schedule,element){
		if(amountEnrolled(schedule.courses) < 5){
			messages[schedule.id]=messages[schedule.id]+'* La cantidad de inscriptos es menor a 5 \n';
			markError(element,schedule);
			return typeMessage.danger;
		}else if(amountEnrolled(schedule.courses) < 15){
			messages[schedule.id]=messages[schedule.id]+'* La cantidad de inscriptos es menor a 15 \n';
			markWarning(element,schedule);
			return typeMessage.warning;

		} else if(amountEnrolled(schedule.courses) > amountCapacity(schedule.courses)) {
			messages[schedule.id]+='* La cantidad de inscriptos supera el cupo \n';
			markError(element,schedule);
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
			markWarning(element,schedule);
			return typeMessage.warning;
		} else if(courseCapacity > classroomCapacity) {
			messages[schedule.id]+='* La cantidad de cupos ('+courseCapacity+') no entra en la capacidad del aula asignada ('+classroomCapacity+') \n';
			markWarning(element,schedule);
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
				markError(element,schedule);
				return;
			}
		});
		
		allResults=true;
		results.forEach(function(result) {
			allResults&=result == typeMessage.ok;
			
		});
		
		if(allResults){
			markOk(element);
		}
		
	}
}
/* EOF */