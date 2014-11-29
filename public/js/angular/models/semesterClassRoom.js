app.factory('SemesterClassRoom', ['$http', 'ClassRoom', function($http, ClassRoom) {
  function SemesterClassRoom(data) {
    if (data) {
      angular.extend(this, data)
    }
    this.classRoom = new ClassRoom(this.classRoom);
  };

  SemesterClassRoom.prototype = {
    getDescription:function(){
      return 'Aula ' + this.classRoom.number + '\n Capacidad: ' + this.capacity
	          + '\n Computadoras: ' + this.numberOfComputers + '\n Tiene proyector: ' + (this.hasProyector ? 'Si' : 'No');
    }
  };
  return SemesterClassRoom;
}]);