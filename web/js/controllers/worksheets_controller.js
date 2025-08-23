'use strict';

angular.module('myApp.controllers').controller('WorksheetsCtrl', ["$scope", "$location", "$http", "$routeParams", "$filter", "Worksheet", "Category", function($scope, $location, $http, $routeParams, $filter, Worksheet, Category) {
    $scope.worksheets = Worksheet.query();
    $scope.categories = Category.query();

    $scope.loadData = function(){
        if($routeParams.category){
            $scope.category = Category.get({id: $routeParams.category});
        }
    };

    $scope.filterWorksheets = function(category){
      if(!$scope.worksheets) return [];
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



    $scope.containsCategory = function(ws, cat){
      for(var i = 0; i < ws.categories.length; i++){
        if(ws.categories[i].name == cat){ return true; }
      }
      return false;
    };


	$scope.deleteCategory = function(){
		if($scope.canDeleteCategory()){
		    var url = "categories/" + $routeParams.category + "/delete";
		    $http.post(url).success(function(data){
		      $location.path("/worsheets");
		    });
		}
	};

	$scope.canDeleteCategory = function(){
		console.log($scope.worksheets);
		console.log($routeParams.category);
		return $routeParams.category && $scope.filterWorksheets($scope.category.name).length == 0;
	};


    $scope.loadData();

}]);