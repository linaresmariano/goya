var indexApp = angular.module('indexApp', [])

indexApp.controller('SemestralGrids', function ($scope) {
  $scope.semesters = [
    { 'semester': 1, 'year': 2014, 'code': '12014' },
    { 'semester': 2, 'year': 2014, 'code': '22014' }
  ]
})
