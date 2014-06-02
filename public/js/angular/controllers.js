var indexApp = angular.module('indexApp', []);

indexApp.controller('SemestralGrids', function ($scope) {
  $scope.semesters = [
    {'code': 12014},
    {'code': 22014}
  ];
});
