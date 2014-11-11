app.factory('SemesterClassRoom', ['$http','ClassRoom' , function($http,ClassRoom) {
  function SemesterClassRoom(data) {
    if (data) {
      angular.extend(this, data)
    }
	this.classRoom =new ClassRoom(this.classRoom);
  };

  SemesterClassRoom.prototype = {

  };
  return SemesterClassRoom;
}]);