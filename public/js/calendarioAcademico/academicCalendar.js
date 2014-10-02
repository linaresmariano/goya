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
	
	var tagExtraDuration=$('#extraDuration').clone();
	var tagExtraHour=$('#extraHour').clone();

    $scope.eventClick = function( event, allDay, jsEvent, view ){
		//Para mostrar el curso
		$scope.scheduleShow=event;
		/*
		//para actualizar los campos
		tagExtraDurationNew=tagExtraDuration.clone();
		tagExtraHourNew=tagExtraHour.clone();
		
	    tagExtraDurationNew.attr('value',$scope.scheduleShow.schedule.patch.extraDuration+"");
		tagExtraHourNew.attr('value',$scope.scheduleShow.schedule.patch.extraHour+"");
		
		parentTagExtraDuratio=$('#extraDuration').parent();
		parentTagExtraHour=$('#extraHour').parent();
		
		$('#extraDuration').remove();
		$('#extraHour').remove();
		
	    parentTagExtraDuratio.append(tagExtraDurationNew);
		parentTagExtraHour.append(tagExtraHourNew);*/
		$scope.newPatchExtras.extraDuration=$scope.scheduleShow.schedule.patch.extraDuration;
		$scope.newPatchExtras.extraHour=$scope.scheduleShow.schedule.patch.extraHour;
		
    };
	
	$scope.unifySchedules=function(schedules){
		firstSchedule=schedules[0];
		for(p=1;p < schedules.length;p++){
			for(j=0;j < schedules[j].courses.length;j++){
				firstSchedule.courses.push(schedules[p].courses[j]);
			}
		}
		return firstSchedule;
	}
	
    $scope.eventDrop = function(event, dayDelta, minuteDelta, allDay, revertFunc, jsEvent, ui, view){
       		if(esHorarioInvalido(event.start.getHours()) ||
		                 esHorarioInvalido(event.end.getHours())){		 
				revertFunc();				
			}else{
			
				seconds=Math.abs(minuteDelta+event.schedule.minutes + (event.schedule.hour * 60) )*60;
				hour=Math.abs(parseInt(seconds/3600));
				minutes=Math.abs(parseInt((seconds-(3600*hour))/60));
				
				event.schedule.day=event.start.getDay();
				event.schedule.hour=hour;
				event.schedule.minutes=minutes;
				
				var deferred = $q.defer();
				var schedules=$scope.getSchedulesAtTheSameTime(event.schedule);
				if(schedules.length != 0){
					schedules.push(event.schedule);
					var newSchedule=$scope.unifySchedules(schedules);
					$.ajax({url:"/schedule/unify",
						method:'put',
						data: {
							schedules:schedules
						},
						success:function(result){
						
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
						for(k=0;k < schedules.length;k++){
							if(k==0){
								$scope.removeSchedule(schedules[k]);
								$scope.addSchedule(schedules[k]);
							}else{
								$scope.removeSchedule(schedules[k]);
							}
							
						}
						
					});
					return;
				}

				$.ajax({url:"/updateCourse",
						method:'put',
						data: {
							id:event.id, hour:hour, day:event.start.getDay(),
							minutes:minutes
						},
						success:function(result){
                        	event.schedule.day=event.start.getDay();
							event.schedule.hour=hour;
							event.schedule.minutes=minutes;
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
				
				
				seconds=Math.abs(date.getMinutes() + (date.getHours() * 60) - ((getMinutes(copiedEventObject.schedule.patch.extraHour) +(getHour(copiedEventObject.schedule.patch.extraHour)*60)) || 0))*60;
				hour=Math.abs(parseInt(seconds/3600));
				minutes=Math.abs(parseInt((seconds-(3600*hour))/60));
				
					$http({
							url:"/updateCourse",
							method:'put',
							data: { id:copiedEventObject.schedule.id, hour:hour,day:date.getDay(),
							minutes:minutes}
					}).success(function(data) {
					
						//Actualizando el schedule con el nuevo horario
						copiedEventObject.schedule.day=date.getDay();
						copiedEventObject.schedule.hour=hour;
						copiedEventObject.schedule.minutes=minutes;
						//Agragando el horario a la grilla
						$scope.addSchedule(copiedEventObject.schedule);
						$scope.removeScheduleNotAssigned(copiedEventObject.schedule);

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
					/**/
					durationHour:hourDuration,
					durationMinutes: minutesDuration
				},
				success:function(result) {
	            	event.schedule.durationHour=hourDuration;
					event.schedule.durationMinutes=minutesDuration;
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
											
											if(!isTeacherOfCourses(event.schedule.courses,$scope.courseTeacher.teacher)){
													$('#assingTeacherCourse').modal('toggle');
											}else{
											
												if(!existSemesterTeacher(event.schedule.semesterTeachers,$scope.courseTeacher.teacher)){
											
													$http({
															url:"/assignedTeacher",
															method:'put',
															data: { idTeacher:$scope.courseTeacher.teacher.id,idCourseSchedule:event.schedule.id,year:$scope.semester.year,semester:$scope.semester.semester}
													}).success(function(data) {
														if(data.success){
															event.schedule.semesterTeachers.push($scope.courseTeacher.teacher);
															deferred.resolve(event);
														}else{
															alert(data.type +' - '+data.message);
														}

													}).error(function(err){
														alert("Error al asignar un profesor a un horario");
													});
												}else{
													alert("El profesor ya fue agregado a este horario");
												}
											}
											
											
											
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
		
	function existSemesterTeacher(semesterTeachers,semesterTeacher){
		
		for(u=0;u < semesterTeachers.length;u++){
			if(semesterTeachers[u].teacher.id == semesterTeacher.teacher.id ){
				return true;
			}
		}
		return false;
	}
	
	function existTeacher(teachers,teacher){
		
		for(n=0;n < teachers.length;n++){
			if(teachers[n].id == teacher.id ){
				return true;
			}
		}
		return false;
	}
	
	function isTeacherOfCourses(courses,semesterTeacher){
		for(n=0;n < courses.length;n++){
			if(isTeacher(courses[n],semesterTeacher) ){
				return true;
			}
		}
		return false;
	}
	
	$scope.getTeachers=function(courses){
		teachers=[];
		if(courses == undefined)return teachers;
		for(b=0;b < courses.length;b++){
			for(c=0;c < courses[b].semesterTeachers.length;c++){
				if(!existTeacher(teachers,courses[b].semesterTeachers[c])){
					teachers.push(courses[b].semesterTeachers[c]);
				}
			}
		}
		return teachers;
	}
	
	$scope.getInstructors=function(courses){
		teachers=[];
		if(courses == undefined)return teachers;
		for(u=0;u < courses.length;u++){
			for(v=0;v < courses[u].semesterInstructors.length;v++){
				if(!existTeacher(teachers,courses[u].semesterInstructors[v])){
					teachers.push(courses[u].semesterInstructors[v]);
				}
			}
		}
		return teachers;
	}
	
	function isTeacher(course,semesterTeacher){
		return existSemesterTeacher(course.semesterTeachers,semesterTeacher) || existSemesterTeacher(course.semesterInstructors,semesterTeacher);
	}
	
	function getMinutes(floatNumber){
		sign=floatNumber >= 0 ? 1 : -1 ;
		return (floatNumber+"").split(".").length == 1 ? 0 : ((floatNumber+"").split(".")[1]-2)*10*sign;
	}
	
	function getHour(floatNumber){
		return parseInt(floatNumber) ;
	}
	
	$scope.getSchedulesAtTheSameTime=function(schedule){
		schedules=[];
        for(h=0;h<$scope.events.length;h++){
            courseInfo=$scope.events[h];
            if(courseInfo.schedule.day == schedule.day && courseInfo.schedule.hour == schedule.hour &&
            courseInfo.schedule.minutes ==  schedule.minutes && courseInfo.schedule.durationHour ==  schedule.durationHour  &&
            courseInfo.schedule.durationMinutes ==  schedule.durationMinutes &&
            courseInfo.schedule.courses[0].subject.name == schedule.courses[0].subject.name && courseInfo.schedule.durationMinutes ==  schedule.durationMinutes &&
			courseInfo.schedule.patch.extraHour == schedule.patch.extraHour &&  courseInfo.schedule.patch.extraDuration == schedule.patch.extraDuration &&
			courseInfo.schedule.type == schedule.type  &&
			courseInfo.schedule.courses[0].id != schedule.courses[0].id  &&
			courseInfo.schedule.courses[0].color == schedule.courses[0].color  &&
			schedule.id != courseInfo.schedule.id)schedules.push(courseInfo.schedule);
        }
        return schedules;
    }

    //Agrega un schedule al calendario
    $scope.addSchedule = function(schedule) {
	
		extraHour=getHour(schedule.patch.extraHour);
		extraMinutes=getMinutes(schedule.patch.extraHour);
		
		extraHourDuration=getHour(schedule.patch.extraDuration);
		extraMinutesDuration=getMinutes(schedule.patch.extraDuration);
      	$scope.events.push({
								id: schedule.id,
								title: (schedule.courses[0].subject ? schedule.courses[0].subject.nick : ''+ "" )+ $scope.getCommissions(schedule) +"\n" +  schedule.type
									+'\n Aula '+(schedule.semesterClassRoom ? schedule.semesterClassRoom.classRoom.number : '??')
									+ getNamesTeachers(schedule.semesterTeachers,schedule.patch),
								start: new Date(y, m-1, d+schedule.day, schedule.hour+extraHour,schedule.minutes+extraMinutes),
								end: new Date(y, m-1, d+schedule.day, schedule.hour+schedule.durationHour+extraHour+extraHourDuration, schedule.minutes+schedule.durationMinutes+extraMinutes+extraMinutesDuration),
								allDay: false,
								backgroundColor: schedule.courses[0].color,
								borderColor: 'black',
								//Datos necesarios del modelo
								schedule:schedule
							});
    };
	
	$scope.getCommissions=function(schedule){
        commissions='';
        for(r=0;r <schedule.courses.length;r++){
            commissions+=' - C'+ schedule.courses[r].commission
        }
        return commissions; 
    }
	
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
	
	function getNamesTeachers(semesterTeachers,patch){
		names="";
		semesterTeachers.forEach(function(semesterTeacher) {
			if(!existTeacher(patch.noVisibleTeachers,semesterTeacher.teacher))
				names+= " \n " + semesterTeacher.teacher.name;
		});
		return names;
	}
	
	$scope.createCourse=function(){
		$scope.infoCoursesNotAssigned.push($scope.events[0]);
	}
	
	//Agruega un schedule como no asignado
    $scope.addScheduleNotAssigned = function(schedule) {
      	$scope.infoCoursesNotAssigned.push({
								//Datos necesarios del modelo
								schedule:schedule
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
	
	$scope.existsSchedule= function(schedule) {
		for(o=0;o< $scope.infoCoursesNotAssigned.length;o++){
			if($scope.infoCoursesNotAssigned[o].schedule.id == schedule.id){
				return true;
			}
		}
		
		for(p=0;p< $scope.events.length;p++){
			if($scope.events[p].schedule.id == schedule.id){
				return true;
			}
		}
		
		return false;
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
		if(isInCharge == 0){
				if($scope.getTeachers($scope.courseTeacher.event.schedule.courses).length == 2){
					alert("Un curso solo puede tener 2 profesores a cargo como máximo");
				}else{
					$http({
						url:"/course/assignedTeacher",
						method:'put',
						data: { idTeacher:$scope.courseTeacher.teacher.id,idCourse:$scope.courseTeacher.event.schedule.courses,year:$scope.semester.year,semester:$scope.semester.semester}
					}).success(function(data) {
															
						
						for(t=0;t<$scope.courseTeacher.event.schedule.courses.length;t++){
							$scope.courseTeacher.event.schedule.courses[t].semesterTeachers.push($scope.courseTeacher.teacher);
						}
						
					}).error(function(err){
						alert("Error al asignar un profesor a un horario");
					});	
				}
								
		}else{
				$http({
					url:"/course/assignedInstructor",
					method:'put',
					data: { idTeacher:$scope.courseTeacher.teacher.id,idCourse:$scope.courseTeacher.event.schedule.courses,year:$scope.semester.year,semester:$scope.semester.semester}
				}).success(function(data) {
													
					for(z=0;z<$scope.courseTeacher.event.schedule.courses.length;z++){
							$scope.courseTeacher.event.schedule.courses[z].semesterInstructors.push($scope.courseTeacher.teacher);
					}

				}).error(function(err){
					alert("Error al asignar un profesor a un horario");
				});	
		}
		$('#assingTeacherCourse').modal('hide')
		//alert("Se debe asignar como profesor"+(isInCharge == 1 ? ' no ' : '')+ ' a cargo a este curso, y al horario');
    };
	
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
	
	function existSemesterTeacherInSchedulesOfCourses(courses,semesterTeacher){
		for(l=0;i<courses.length;l++){
			if(existSemesterTeacherInSchedules(courses[l],semesterTeacher)) return true;
		}
		return false;
	}
	
	$scope.deallocateCourseTeacher=function(idTeacher,semesterTeacher){
		/*if(existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,semesterTeacher)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}*/
		
		$http({
			url:"/course/deallocateTeacher",
			method:'put',
			data: { courses:$scope.scheduleShow.schedule.courses,idTeacher:idTeacher}
		}).success(function(data) {
			
			for(j=0;j<$scope.scheduleShow.schedule.courses.length;j++){
				for(k=0;k<$scope.scheduleShow.schedule.courses[j].semesterTeachers.length;k++){
					if($scope.scheduleShow.schedule.courses[j].semesterTeachers[k].id ==idTeacher){
						$scope.scheduleShow.schedule.courses[j].semesterTeachers.splice(k,1);
					}
				}
			}
		}).error(function(err){
			alert("Error al desasignar un profesor");
		});	

	}
	
	$scope.deallocateCourseInstructor=function(idTeacher,semesterTeacher){
	
		/*if(existSemesterTeacherInSchedulesOfCourses($scope.scheduleShow.schedule.courses,semesterTeacher)){
					alert('El profesor esta asignado en algun horario de este curso,asegurese de quitarlo');
					return;
		}*/
		$http({
			url:"/course/deallocateInstructor",
			method:'put',
			data: { idCourse:$scope.scheduleShow.schedule.courses,idTeacher:idTeacher}
		}).success(function(data) {

			for(j=0;j<$scope.scheduleShow.schedule.courses.length;j++){
				for(k=0;k<$scope.scheduleShow.schedule.courses[j].semesterInstructors.length;k++){
					if($scope.scheduleShow.schedule.courses[j].semesterInstructors[k].id ==idTeacher){
						$scope.scheduleShow.schedule.courses[j].semesterInstructors.splice(k,1);
					}
				}
			}
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
	
	$scope.hideTeacher=function(teacher){
		noVisibleTeachers=$scope.scheduleShow.schedule.patch.noVisibleTeachers;
		var deferred = $q.defer();
		if(!existTeacher($scope.scheduleShow.schedule.patch.noVisibleTeachers,teacher)){

			$http({
				url:"/patch/teacherHide",
				method:'put',
				data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id}
			}).success(function(data) {
				noVisibleTeachers.push(teacher);
				deferred.resolve();
				
			}).error(function(err){
				alert("Error al desasignar un profesor");
			});	
		
		}else{
			for(j=0;j<noVisibleTeachers.length;j++){
				if(teacher.id == noVisibleTeachers[j].id){
					
					$http({
						url:"/patch/teacherVisible",
						method:'put',
						data: { idPatch:$scope.scheduleShow.schedule.patch.id,idTeacher:teacher.id}
					}).success(function(data) {
						noVisibleTeachers.splice(j,1);
						deferred.resolve();
						
					}).error(function(err){
						alert("Error al desasignar un profesor");
					});	
					break;
				}
			}	
		}
		
		//Refresh calendario
		var promise=deferred.promise;
		promise.then(function() {
					$scope.removeSchedule($scope.scheduleShow.schedule);
					$scope.addSchedule($scope.scheduleShow.schedule);
				});

	}
	
	$scope.isHideTeacher=function(teacher){
		return existTeacher($scope.scheduleShow.schedule.patch.noVisibleTeachers,teacher);
	}
	
	$scope.newPatchExtras={};
	$scope.updatePatch = function() {
		var deferred = $q.defer();
		$http({
			url:"/patches/update",
			method:'put',
			data: { extraHour:$scope.newPatchExtras.extraHour, extraDuration: $scope.newPatchExtras.extraDuration,idPatch:$scope.scheduleShow.schedule.patch.id}
		}).success(function(data) {
			$scope.scheduleShow.schedule.patch.extraDuration=$scope.newPatchExtras.extraDuration;
			$scope.scheduleShow.schedule.patch.extraHour=$scope.newPatchExtras.extraHour;
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
	
	
	function existSemesterTeacherInSchedules(schedules,teacher){
		for(i=0;i<schedules.length;i++){
			if(existSemesterTeacher(schedules[i].semesterTeachers,teacher)){
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


	
	//Modelos relacionados con la vista
	$scope.courseTeacher={};
	
	$scope.scheduleShow;
	
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
				if(!$scope.existsSchedule(horario)){
					$scope.addScheduleNotAssigned(replaceCourse(horario,$scope.courses));
				}
				
			}else{
					if(!$scope.existsSchedule(horario)){
						c=replaceCourse(horario,$scope.courses)
						$scope.addSchedule(replaceCourse(horario,$scope.courses));
					}
				}
			}
			$scope.courses[i].schedules=[];
	}
	/* event sources array*/
    $scope.eventSources = [$scope.events];
	
	function replaceCourse(schedule,courses){
		for(h=0; h<schedule.courses.length; h++) {
			for(x=0; x< courses.length; x++) {
				if(schedule.courses[h].id == courses[x].id){
					schedule.courses.splice(h,1);
					schedule.courses.push(courses[x]);
				}
			}
		}
		return schedule;
	}
	
	function esHorarioInvalido(hora){
	   if((hora >= 0 && hora<8) || hora>22  ){
			return true;
	   }
	   return false;
	}

}
/* EOF */