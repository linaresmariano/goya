var db = require('../tests')

// Career
var tpi = db.Career.build({
  nick: 'TPI',
  name: 'Tecnicatura en Programación Informática',
  group: 'P'
})

var lds = db.Career.build({
  nick: 'LDS',
  name: 'Licenciatura en Desarrollo de Software',
  group: 'W'
})

var diplo = db.Career.build({
  nick: 'Diplomatura CyT',
  name: 'Diplomatura en Ciencia y Tecnología',
  group: 'N'
})

//Semesters
var semester = db.Semester.build({
  semester: 1,
  year: 2014
});

var semester1 = db.Semester.build({
  semester: 2,
  year: 2013
});

var semester2 = db.Semester.build({
  semester: 1,
  year: 2013
});

var semester3 = db.Semester.build({
  semester: 2,
  year: 2012
});
//Courses							
var courseEPERS = db.Course.build({
  commission: 1,
  modality: 0,
  capacity: 25,
  enrolled: 7,
  color: 'red',
  nick: 'EPERS'
});

var courseORGA = db.Course.build({
  enrolled: 7,
  commission: 1,
  modality: 1,
  capacity: 20,
  color: 'green',
  nick: 'ORGA'
});

var courseORGA2 = db.Course.build({
  enrolled: 30,
  commission: 2,
  modality: 1,
  capacity: 35,
  color: 'green',
  nick: 'ORGA'
});

var courseTVD = db.Course.build({
  enrolled: 30,
  commission: 1,
  modality: 1,
  capacity: 35,
  color: 'yellow',
  nick: 'TVD'
});

//patches schedules
var patchSchedule1 = db.PatchSchedule.build({
  extraHour: 0,
  extraDuration: -1.5
});

//patches schedules
var patchSchedule2 = db.PatchSchedule.build({
  extraHour: 0,
  extraDuration: 0,
});

var patchSchedule3 = db.PatchSchedule.build({
  extraHour: 0,
  extraDuration: 0,
});


var patchSchedule4 = db.PatchSchedule.build({
  extraHour: 0.5,
  extraDuration: 0
});

var patchSchedule5 = db.PatchSchedule.build({
  extraHour: 2.5,
  extraDuration: 0.5
});

var patchSchedule6 = db.PatchSchedule.build({
  extraHour: 0,
  extraDuration: 0
});

var patchSchedule7 = db.PatchSchedule.build({
  extraHour: 0,
  extraDuration: 0
});


//Schedules								
var courseSchedule1 = db.CourseSchedule.build({
  type: 'Teórica/Práctica',
  day: 5,
  hour: 9,
  minutes: 0,
  durationHour: 6,
  durationMinutes: 0
});

var courseSchedule2 = db.CourseSchedule.build({
  type: 'Práctica',
  day: -1,
  hour: -1,
  minutes: 0,
  durationHour: 3,
  durationMinutes: 0
});

var courseSchedule3 = db.CourseSchedule.build({
  type: 'Teórica',
  day: 1,
  hour: 10,
  minutes: 0,
  durationHour: 3,
  durationMinutes: 0
});

var courseSchedule4 = db.CourseSchedule.build({
  type: 'Teórica/Práctica',
  day: 2,
  hour: 17,
  minutes: 0,
  durationHour: 3,
  durationMinutes: 0
});

var courseSchedule5 = db.CourseSchedule.build({
  type: 'Práctica',
  day: -1,
  hour: -1,
  minutes: 0,
  durationHour: 2,
  durationMinutes: 0
});

var courseSchedule6 = db.CourseSchedule.build({
  type: 'Teórica',
  day: -1,
  hour: -1,
  minutes: 0,
  durationHour: 2,
  durationMinutes: 0
});

var courseSchedule7 = db.CourseSchedule.build({
  type: 'Teórica',
  day: -1,
  hour: -1,
  minutes: 0,
  durationHour: 3,
  durationMinutes: 0
});

//Teachers								
var teacherPABLOT = db.Teacher.build({
  code: 'PABLOT',
  name: 'Pablo Tesone'
});

var teacherRONY = db.Teacher.build({
  code: 'RONY',
  name: 'Rony De Jesus'
});

//ClassRooms

var classRoom37B = db.ClassRoom.build({
  name: "Fidel",
  number: "37b",
  description: "Un aula con pcs",
  capacity: 13,
  numberOfComputers: 30,
  hasProyector: true
});

var classRoom60 = db.ClassRoom.build({
  name: "Mariano",
  number: "60",
  description: "Un aula con pcs nueva",
  capacity: 500,
  numberOfComputers: 30,
  hasProyector: true
});

var classRoomcyt = db.ClassRoom.build({
  name: "cyt",
  number: "1",
  description: "Un aula con pcs nueva",
  capacity: 30,
  numberOfComputers: 30,
  hasProyector: true
});

var classRoom45 = db.ClassRoom.build({
  name: "45",
  number: "45",
  description: "Un aula sin pcs nueva",
  capacity: 30,
  numberOfComputers: 0,
  hasProyector: true
});
//Subject

var subjectEPERS = db.Subject.build({
  area: 0,
  core: 1,
  period: 'Cuatrimestral',
  ocode: '01044',
  credits: 12,
  nick: 'EPERS',
  name: 'Estrategias de persistencia'
});

var subjectORGA = db.Subject.build({
  area: 1,
  core: 0,
  period: 'Cuatrimestral',
  ocode: '01032',
  credits: 12,
  nick: 'ORGA',
  name: 'Organizacion de las computadoras'
});

var subjectTVDIG = db.Subject.build({
  area: 1,
  core: 0,
  period: 'Cuatrimestral',
  ocode: '01032',
  credits: 12,
  nick: 'TVD',
  name: 'Television Digital'
});

var subjectING1 = db.Subject.build({
  area: 4,
  core: 3,
  period: 'Cuatrimestral',
  ocode: '90000',
  credits: 0,
  nick: 'ING1',
  name: 'Inglés 1'
});

//Save models
chainer = new db.Sequelize.Utils.QueryChainer

//save career
chainer.add(tpi.save());
chainer.add(lds.save());
chainer.add(diplo.save());

//save courses
chainer.add(courseORGA.save());
chainer.add(courseORGA2.save());
chainer.add(courseEPERS.save());
chainer.add(courseTVD.save());

//save models
chainer.add(semester.save());
chainer.add(semester1.save());
chainer.add(semester2.save());
chainer.add(semester3.save());

//save teachers
chainer.add(teacherPABLOT.save());
chainer.add(teacherRONY.save());

//save schedules
chainer.add(courseSchedule1.save());
chainer.add(courseSchedule2.save());
chainer.add(courseSchedule3.save());
chainer.add(courseSchedule4.save());
chainer.add(courseSchedule5.save());
chainer.add(courseSchedule6.save());
chainer.add(courseSchedule7.save());

//save patchSechedules
chainer.add(patchSchedule1.save());
chainer.add(patchSchedule2.save());
chainer.add(patchSchedule3.save());
chainer.add(patchSchedule4.save());
chainer.add(patchSchedule5.save());
chainer.add(patchSchedule6.save());
chainer.add(patchSchedule7.save());

//save class rooms
chainer.add(classRoom37B.save());
chainer.add(classRoom60.save());
chainer.add(classRoomcyt.save());
chainer.add(classRoom45.save());

//save subjects
chainer.add(subjectEPERS.save());
chainer.add(subjectORGA.save());
chainer.add(subjectTVDIG.save());
chainer.add(subjectING1.save());

module.exports = function(callBakcFuncSucces) {
  chainer.run().complete(function(err, result) {
    semester.addCourse(courseEPERS).success(function() {
      semester.addCourse(courseORGA).success(function() {
        semester.addCourse(courseTVD).success(function() {
          semester.addCourse(courseORGA2).success(function() {

            courseEPERS.setSubject(subjectEPERS).success(function() {
              courseORGA.setSubject(subjectORGA).success(function() {
                courseORGA2.setSubject(subjectORGA).success(function() {
                  courseTVD.setSubject(subjectTVDIG).success(function() {

                    subjectEPERS.setCareer(tpi).success(function() {
                      subjectORGA.setCareer(tpi).success(function() {
                        subjectTVDIG.setCareer(tpi).success(function() {
                          subjectING1.setCareer(diplo).success(function() {


                            courseSchedule1.setPatch(patchSchedule1).success(function() {
                              courseSchedule2.setPatch(patchSchedule2).success(function() {
                                courseSchedule3.setPatch(patchSchedule3).success(function() {
                                  courseSchedule4.setPatch(patchSchedule4).success(function() {
                                    courseSchedule5.setPatch(patchSchedule5).success(function() {
                                      courseSchedule6.setPatch(patchSchedule6).success(function() {
                                        courseSchedule7.setPatch(patchSchedule7).success(function() {

                                          courseEPERS.addSchedule(courseSchedule1).success(function() {
                                            courseORGA.setSchedules([courseSchedule2, courseSchedule3, courseSchedule4]).success(function() {
                                              courseORGA2.addSchedule(courseSchedule7).success(function() {
                                                courseTVD.addSchedule(courseSchedule5, courseSchedule6).success(function() {

                                                  callBakcFuncSucces();

                                                });
                                              });
                                            });
                                          });
                                        });
                                      });
                                    });
                                  });
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });

  });
}