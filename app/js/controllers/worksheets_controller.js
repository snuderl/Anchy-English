'use strict';

angular.module('myApp.controllers').controller('WorksheetsCtrl', ["$scope", "$http", "$routeParams", "$filter", "Worksheet", "Category", function($scope, $http, $routeParams, $filter, Worksheet, Category) {
    $scope.worksheets = Worksheet.query();
    $scope.categories = Category.query();

    $scope.loadData = function(){
        if($routeParams.category){
            $scope.category = Category.get({id: $routeParams.category});
        }
    };

    $scope.loadData();

}]);