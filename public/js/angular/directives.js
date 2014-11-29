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
        start: function(event, ui) {

          //Creando un clon del tag teacher para draggearlo afuera del scroll
          clone = elm.clone();
          clone.css('width', elm.css('width'));
          clone.css('position', 'absolute');
          $('body').append(clone);
          $('body').css('cursor', 'pointer');
          elm.css('display', 'none');
        },
        zIndex: 999,
        revert: true,
        revertDuration: 0,
        drag: function(event, ui) {
          clone.css('left', elm.css('left'));
          clone.css('top', (event.pageY - 15) + "px");
        },
        stop: function(event, ui) {
          clone.remove();
          elm.css('display', 'block');
          elm.draggable('enable');
          $('body').css('cursor', 'auto');
        }
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
        start: function(event, ui) {

          //Creando un clon del tag teacher para draggearlo afuera del scroll
          clone = elm.clone();
          clone.css('width', elm.css('width'));
          clone.css('position', 'absolute');
          $('body').append(clone);
          $('body').css('cursor', 'pointer');
          elm.css('display', 'none');

        },
        drag: function(event, ui) {
          clone.css('left', elm.css('left'));
          clone.css('top', (event.pageY - 15) + "px");
          //clone.css('top',150+"px");
        },
        zIndex: 999,
        revert: true,
        revertDuration: 0,
        stop: function(event, ui) {
          clone.remove();
          elm.css('display', 'block');
          $('body').css('cursor', 'auto');
        }
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
        start: function(event, ui) {
          clone = elm.clone();
          clone.css('width', elm.css('width'));
          clone.css('position', 'absolute');
          $('body').append(clone);
          $('body').css('cursor', 'pointer');
          elm.css('display', 'none');
        },
        drag: function(event, ui) {
          clone.css('left', elm.css('left'));
          clone.css('top', (event.pageY - 15) + "px");
        },
        zIndex: 999,
        revert: true,
        revertDuration: 0,
        stop: function(event, ui) {
          clone.remove();
          elm.css('display', 'block');
          $('body').css('cursor', 'auto');
        }
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