'use strict';

angular.module('myApp.controllers').controller('WorksheetsCtrl', ["$scope", "$http", "$routeParams", "Worksheet", "Category", function($scope, $http, $routeParams, Worksheet, Category) {
    $scope.worksheets = Worksheet.query();
    $scope.categories = Category.query();
    $scope.category = null;

    $scope.getWorksheets = function(){
        $http.get("/worksheet/").success(function(data){
          $scope.worksheets = data.worksheets;
          $scope.categories = data.categories;  



          for(var i = 0; i < $scope.categories.length; i++){
            var c = $scope.children($scope.categories[i].name);
            $scope.categories[i].children = c;
          }
        });
    };

    $scope.children = function(parent){
      var result = [];
      console.log(parent);
      for(var i = 0; i < $scope.categories.length; i++){
        var cat = $scope.categories[i];
        if(cat.parent == parent){
          result.push(cat.name);
        }
      }
      console.log(result);
      return result;
    };

    $scope.loadData = function()
    {
      $scope.getWorksheets();
      if($routeParams.category){
        $scope.category = $routeParams.category;
        $scope.worksheets = $scope.filterWorksheets($scope.category);
      }
    };

    $scope.containsCategory = function(ws, cat){

      for(var i = 0; i < ws.categories.length; i++){
        if(ws.categories[i].name == cat){ return true; }
      }

      return false;
    };

    $scope.filterWorksheets = function(category){
      var arr = new Array();
      for(var i = 0; i < $scope.worksheets.length; i++){
        var elem = $scope.worksheets[i];
        if(category == "" && elem.categories.length == 0){
          arr.push(elem);
        }
        else if($scope.containsCategory(elem, category)){
          arr.push(elem);
        }
      }
      return arr;
    };
}]);