var db = require('../models'),
    fs = require('fs'),
    classrooms = __dirname + '/historial/classrooms.json',
    teachers = __dirname + '/historial/teachers.json',
    semesters = __dirname + '/historial/semesters/'


// Load classrooms
require(classrooms).classrooms
  .forEach(function(room) {

    db.ClassRoom.create({
      code: room.code,
      capacity: room.capacity
    })
  })


// Load teachers
require(teachers).teachers
  .forEach(function(teacher) {

    db.Teacher.create({
      code: teacher.code,
      name: teacher.name
    })
  })


// Load all semesters
fs
  .readdirSync(semesters)
    .forEach(function(file) {

      var info = require(semesters + file),
          semester = info.semester,
          number = semester.semester,
          year = semester.year,
          id = number +""+ year

      // Create semester
      db.Semester.create({
        id: id,
        semester: number,
        year: year
      }).success(function(semes) {

        // Create courses
        info.courses
          .forEach(function(course) {

            db.Course.create({
              SemesterId: semes.id,
              code: course.code,
              commission: course.commission,
              semester: course.semester,
              enrolled: course.enrolled,
              capacity: course.capacity,
              color: course.color

            }).success(function(cour) {

              
              course.schedules
                .forEach(function(schedule) {

                  db.CourseSchedule.create({
                    type: schedule.type,
                    day: schedule.day,
                    hour: schedule.hour,
                    minutes: schedule.minutes,
                    duration: schedule.duration
                  })

                })
            })
          })
      })
    })