
app.controller('subjectCtrl', function ($scope, localStorageService, subjectService) {

  $scope.areas = subjectService.areas

  $scope.cores = subjectService.cores

  $scope.init = function(careers, subject) {
    $scope.careers = careers

    if(subject) {
      $scope.subject = subject
      
      $scope.subject.career = getById(careers, subject.CareerId)
      $scope.subject.area = subjectService.areas[subject.area]
      $scope.subject.core = subjectService.cores[subject.core]

    } else {
      $scope.subject = {}
      $scope.subject.period = 'Cuatrimestral'

      $scope.subject.dictateCareers = []
    }
  }


  $scope.addDictate = function(dictate){
    if(dictate != null && !isRepeat(dictate)) {
      $scope.subject.dictateCareers.push(dictate)
    }
  }

  function isRepeat(dictate){
    for(i =0; i < $scope.subject.dictateCareers.length; i++) {
      var career = $scope.subject.dictateCareers[i]
      if(career.id == dictate.id) {
        return true
      }
    }

    return false
  }

  $scope.remove = function(index) {
    $scope.subject.dictateCareers.splice(index, 1)
  }

  $scope.isEditing = function() {
    return $scope.subject.id != undefined
  }

  // PREC: ID is in an element of list
  function getById(list, id) {
    for(var i = 0; i < list.length; i++) {
      if(list[i].id == id) {
        return list[i]
      }
    }
  }

  function remove(list, elem) {
    var i = list.indexOf(elem);
    if(i != -1) {
      list.splice(i, 1);
    }
  }
  
})
