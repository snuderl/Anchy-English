'use strict';

/* Directives */


angular.module('myApp.directives', []).
  directive('categoryDisplay', ["RecursionHelper", function(RecursionHelper) {
    return {
      restrict: "E",
      scope: {
        category: "=",
        worksheets: "=",
        categories: "=",
        selected: "="
      },
      compile: function(element) {
            return RecursionHelper.compile(element, function(scope, iElement, iAttrs, controller, transcludeFn){
                // Define your normal link function here.
                // Alternative: instead of passing a function,
                // you can also pass an object with 
                // a 'pre'- and 'post'-link function.
            });
      },
      controller: function($scope){

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

        $scope.select = function(category){
          $scope.category = category;
        };

        $scope.containsCategory = function(ws, cat){
          for(var i = 0; i < ws.categories.length; i++){
            if(ws.categories[i].name == cat){ return true; }
          }
          return false;
        };
      },
      templateUrl: "category.html"
    };
  }]).directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).directive("worddisplay", [function(){
  	return {
     	restrict: 'E',
  		scope: {
  			pair: "=",
  			visible: "=",
  			edit: "=",
  			resuj: "=",
  			finished: "="
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
  				var word = $scope.pair.english;
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
  					if(newValue.length > $scope.pair.english.length){
  						$scope.input = newValue.substring(0, $scope.pair.english.length);
  					}
  					else{

  						if($scope.isFinished(newValue)){
  							$("#input"+$scope.pair.english).focusNextInputField();
  							$scope.finished = true;
  						}

	  					for(var i = 0; i < newValue.length; i++){
	  						var inpC = newValue[i];
	  						if(newValue[i] != "" && newValue[i] != $scope.pair.english[i] && $scope.inputArray[i] != newValue[i]){
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
					return $scope.pair.english[ind];
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
					var ch = $scope.pair.english[ind];
					var entered = $scope.inputArray[ind];

					if(entered){						
						if(ch == entered){
							return "correct";
						}else if(ch == entered.toLowerCase() || ch == entered.toUpperCase()){
              return "wrong-case";
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


/// 0 is a normal little characted
/// 1 is character that takes whole line
/// 2 is a small character that goes bellow the line
var words = {
  "a": 0, "A": 1,
  "b": 1, "B": 1,
  "c": 0, "C": 1,
  "d": 1, "D": 1,
  "e": 0, "E": 1,
  "f": 1, "F": 1,
  "g": 2, "G": 1,
  "h": 1, "H": 1,
  "i": 0, "I": 1,
  "j": 2, "J": 1,
  "k": 1, "K": 1,
  "l": 1, "L": 1,
  "m": 0, "M": 1,
  "n": 0, "N": 1,
  "o": 0, "O": 1,
  "p": 2, "P": 1,
  "r": 0, "R": 1,
  "s": 0, "S": 1,
  "t": 1, "T": 1,
  "u": 0, "U": 1,
  "v": 0, "V": 1,
  "q": 2, "Q": 1,
  "z": 0, "Z": 1,
  "y": 2, "Y": 1,
  "x": 0, "X": 1,
  "w": 0, "W": 1
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