var datos = require('../../models/datos');
/*
 * GET grilla.
 */

exports.index = function(req, res){

  var date = new Date(1000,0,26);
  var d = date.getDate();
  var m = date.getMonth();
  var y = date.getFullYear();
  
  events = [
      {
            id: 1,
            title: 'EPERS',
            start: new Date(y, m, d+2, 14, 0),
            end: new Date(y, m, d+2, 16, 0),
            allDay: false,
            backgroundColor: 'red',
      },
      {
            id: 2,
            title: 'ORGA',
            start: new Date(y, m, d+4, 19, 0),
            allDay: false,
            backgroundColor: 'green'
      },
      {
            id: 3,
            title: 'INTRO',
            start: new Date(y, m, d, 16, 0),
            allDay: false,
            backgroundColor: 'yellow'
      },
  ]

  res.render('grilla/index', { title: 'Grilla', datos: datos, events: events });
};


