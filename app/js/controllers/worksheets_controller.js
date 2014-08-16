'use strict';

angular.module('myApp.controllers').controller('WorksheetsCtrl', ["$scope", "$http", "$routeParams", "Worksheet", "Category", function($scope, $http, $routeParams, Worksheet, Category) {
    $scope.worksheets = Worksheet.query();
    $scope.categories = Category.query();
    $scope.category = null;

    $scope.loadData = function()
    {
      if($routeParams.category){
        $scope.category = $routeParams.category;
        $scope.worksheets = $scope.filterWorksheets($scope.category);
      }
    };
}]);