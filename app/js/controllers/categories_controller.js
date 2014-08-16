'use strict';

angular.module('myApp.controllers').controller('CategoriesCtrl', ["$scope", "$http", "$routeParams", "$location", "Category", "Worksheet", function($scope, $http, $routeParams, $location, Category, Worksheet) {
    $scope.category = new Category();
    $scope.categoryNames = [];
    $scope.categories = Category.query();

    $scope.children = function(parent){
      var result = [];
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
        var url = "/categories";
        
        $scope.category.$save().then(function(data){
          $scope.category = new Category();
        });
      }
    };

    $scope.canAddCategory = function(){
      return !!$scope.category.name;
    };
  }]);