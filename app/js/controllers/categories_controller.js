'use strict';

angular.module('myApp.controllers').controller('CategoriesCtrl', ["$scope", "$http", "$routeParams", "$location", "Category", "Worksheet", function($scope, $http, $routeParams, $location, Category, Worksheet) {
    $scope.category = new Category();
    $scope.categoryNames = [];
    $scope.categories = Category.query();
    $scope.filtered = null;
    $scope.worksheets = Worksheet.query();
    $scope.selected = {};

    $scope.children = function(parent){
      var result = [];
      console.log($scope.categories.length);
      for(var i = 0; i < $scope.categories.length; i++){
        var cat = $scope.categories[i];
        console.log(cat);
        console.log(parent);
        if(cat.parent_id == parent.id){
          result.push(cat);
        }
      }
      return result;
    };

    $scope.addCategory = function(){
      if($scope.canAddCategory()){
        var url = "/categories";
        
        $scope.category.$save().then(function(data){
          $scope.category = new Category();
          $scope.categories = Category.query();
        });
      }
    };

    $scope.canAddCategory = function(){
      return !!$scope.category.name;
    };
  }]);