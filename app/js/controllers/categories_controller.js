'use strict';

angular.module('myApp.controllers').controller('CategoriesCtrl', ["$scope", "$http", "$routeParams", "$location", "Category", function($scope, $http, $routeParams, $location, Category) {
    $scope.worksheets = [];
    $scope.category = null;
    $scope.categoryNames = [];
    $scope.categories = Category.query();

    $scope.categoryName = "";
    $scope.parentName = "";

    $scope.getWorksheets = function(){
        $http.get("/worksheet/").success(function(data){
          $scope.worksheets = data.worksheets;
          $scope.categories = data.categories;  


          $scope.categoryNames = [];

          for(var i = 0; i < $scope.categories.length; i++){
            var c = $scope.children($scope.categories[i].name);
            //$scope.categories[i].children = c;
            $scope.categoryNames.push($scope.categories[i].name);
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

    $scope.addCategory = function(){
      if($scope.canAddCategory()){
        var url = "/categories/save";
        var data = {name: $scope.categoryName, parent: $scope.parentName};

        $scope.categoryName = "";
        $scope.parentName = "";

        $http.post(url, data).success(function(data){
          $scope.getWorksheets();
        });
      }
    };

    $scope.canAddCategory = function(){
      return $scope.categoryName != "";
    };

    $scope.loadData = function()
    {
      $scope.getWorksheets();
      if($routeParams.category){
        $scope.category = $routeParams.category;
        $scope.worksheets = $scope.filterWorksheets($scope.category);
      }
    };



    $scope.filterWorksheets = function(category){
      var arr = new Array();
      for(var i = 0; i < $scope.worksheets.length; i++){
        var elem = $scope.worksheets[i];
        if(category == "" && elem.categories.length == 0){
          arr.push(elem);
        }
        else if(elem.categories.indexOf(category) > -1){
          arr.push(elem);
        }
      }
      return arr;
    };

    $scope.loadData();
  }]);