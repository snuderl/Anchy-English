'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).directive("worddisplay", [function(){
  	console.log("bu");
  	return {
     	restrict: 'E',
  		scope: {
  			pair: "=",
  			visible: "=",
  			edit: "="
  		},
  		controller: function($scope){
  			$scope.mapping = words;
		    $scope.displayWord = function(ind, pair){
			  if($scope.visible || pair.visible){
			    return pair.word[ind];
			  }
			  else{
			    return "";
			  }
			}
  		},
  		templateUrl: "wordDisplay.html"
  	}
  }]);



var words = {
  "a": 0,
  "b": 0,
  "c": 0,
  "d": 1,
  "e": 0,
  "f": 1,
  "g": 2,
  "h": 1,
  "i": 1,
  "j": 2,
  "k": 1,
  "l": 1,
  "m": 0,
  "n": 0,
  "o": 0,
  "p": 2,
  "r": 0,
  "s": 0,
  "t": 1,
  "u": 0,
  "v": 0,
  "z": 0,
  "y": 2,
  "x": 0,
  "w": 0
};