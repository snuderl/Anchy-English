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
  			$scope.errorCount = 0;
  			$scope.finished = false;

  			$scope.$watch("resuj", function(o,n){
  				console.log($scope.resuj);
  			});


  			$scope.isFinished = function(input){
  				var word = $scope.pair.word;
  				if(input.length != word.length){
  					return false;
  				}

  				for(var i = 0; i < input.length;i++){
  					if(input[i] != word[i]){
  						return false;
  					}
  				}
  				return true;
  			};

  			$scope.$watch("input", function(newValue, oldValue){
  				if(newValue){
  					if(newValue.length > $scope.pair.word.length){
  						$scope.input = newValue.substring(0, $scope.pair.word.length);
  					}
  					else{

  						if($scope.isFinished(newValue)){
  							$("#input"+$scope.pair.word).focusNextInputField();
  							$scope.finished = true;
  						}

	  					for(var i = 0; i < newValue.length; i++){
	  						var inpC = newValue[i];
	  						if(newValue[i] != "" && newValue[i] != $scope.pair.word[i] && $scope.inputArray[i] != newValue[i]){
	  							$scope.errorCount++;
	  						}
	  					}

	  					$scope.inputArray = new Array();

	  					for(var i = 0; i < newValue.length; i++){
	  						$scope.inputArray[i] = newValue[i];
	  					}
  					}
  				}
  				else{
  					for(var i = 0; i < $scope.inputArray.length; i++){
  						$scope.inputArray[i] = "";
  					}
  				}

				console.log($scope.errorCount);
  			});

		    $scope.displayWord = function(ind){
				if($scope.visible){
					return $scope.pair.word[ind];
				}
				if($scope.resuj){
					var val = $scope.inputArray[ind];
					if(val){
						return val;
					}
				}
				return "";
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


$.fn.focusNextInputField = function() {
    return this.each(function() {
        var fields = $(this).parents('form:eq(0),body').find('button,input,textarea,select').not(':hidden');
        var index = fields.index( this );
        if ( index > -1 && ( index + 1 ) < fields.length ) {
            fields.eq( index + 1 ).focus();
        }
        else {fields.first().focus();}
        return false;
    });
};