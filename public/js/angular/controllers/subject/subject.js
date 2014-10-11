
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

      $scope.dictateCareers = subject.dictateCareers

    } else {
      $scope.subject = {}
      $scope.subject.period = 'Cuatrimestral'

      $scope.dictateCareers = []
    }
  }


  $scope.addDictate = function(dictate){
    if(dictate != null && !isRepeat(dictate)) {
      $scope.dictateCareers.push(dictate)
    }
  }

  function isRepeat(dictate){
    for(i =0; i < $scope.dictateCareers.length; i++) {
      var career = $scope.dictateCareers[i]
      if(career.id == dictate.id) {
        return true
      }
    }

    return false
  }

  $scope.remove = function(index) {
    $scope.dictateCareers.splice(index, 1)
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
  
})
