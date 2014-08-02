var indexApp = angular.module('APP', [])

indexApp.controller('SemestralGrids', function ($scope) {
  $scope.semesters = semestersJSON;
})
