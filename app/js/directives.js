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
  			edit: "=",
  			resuj: "="
  		},
  		controller: function($scope){
  			$scope.mapping = words;
  			$scope.input = "";
  			$scope.inputArray = new Array();

  			$scope.$watch("input", function(newValue, oldValue){
  				if(newValue){
  					if(newValue.length > $scope.pair.word.length){
  						$scope.input = newValue.substring(0, $scope.pair.word.length);
  					}
  					else{
	  					$scope.inputArray = new Array();
	  					for(var i = 0; i < newValue.length; i++){
	  						$scope.inputArray[i] = newValue[i];
	  					}
  					}
  				}
  			});

		    $scope.displayWord = function(ind){
		      if($scope.resuj){
		      	var val = $scope.inputArray[ind];
		      	if(val){
		      		return val;
		      	}
		      }else{
				  if($scope.visible || $scope.pair.visible){
				    return $scope.pair.word[ind];
				  }
				  else{
				    return "";
				  }
				}
			}

			$scope.classForWord = function(ind){
				if($scope.resuj){
					var ch = $scope.pair.word[ind];
					var entered = $scope.inputArray[ind];
					if(entered){						
						if(ch == entered){
							return "correct";
						}else{
							return "wrong";
						}
					}

				}
				return "";
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
  "i": 0,
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