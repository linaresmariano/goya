app.factory('ClassRoom', ['$http', function($http) {
  function ClassRoom(data) {
    if (data) {
      angular.extend(this, data)
    }

  };

  ClassRoom.prototype = {
	newSemesterClassRoom:function(){
		return {
				id:this.id,
				description: this.description,
				capacity: this.capacity,
				numberOfComputers: this.numberOfComputers,
				hasProyector: this.hasProyector,
				classRoom:{	name: this.name,
							number: this.number 
							}
			}
	}
  };
  return ClassRoom;
}]);