var datos = require('../../models/datos');
/*
 * GET grilla.
 */

exports.index = function(req, res){
  res.render('grilla/index', { title: 'Grilla' ,datos: datos});
};


