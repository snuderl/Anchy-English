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
      controller: function($scope, $sanitize){

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
  }]).directive("characterinput", [function(){
    return {
      restrict: 'E',
      scope: {
        character: "=",
        index: "=",
        wordLength: "=",
        onCharacterChange: "&",
        onComplete: "&",
        resuj: "=",
        finished: "="
      },
      template: '<input type="text" ng-model="inputValue" ng-keydown="handleKeyDown($event)" ng-blur="validateCharacter()" maxlength="1" ng-disabled="finished" ng-class="getInputClasses()">',
      controller: function($scope, $element) {
        $scope.inputValue = "";
        $scope.isValid = null;
        $scope.mapping = words; // Use the same character mapping as worddisplay
        
        $scope.handleKeyDown = function(event) {
          var input = event.target;
          var key = event.key;
          
          if (key === 'ArrowRight' || (key !== 'Backspace' && $scope.inputValue && key.length === 1)) {
            $scope.moveToNext();
          } else if (key === 'ArrowLeft') {
            $scope.moveToPrevious();
          } else if (key === 'Backspace') {
            if (!$scope.inputValue) {
              // Current box is empty, delete previous character
              $scope.deletePreviousAndMoveTo();
              event.preventDefault();
            } else {
              // Current box has content, let it delete normally
              // The normal backspace will clear this box, and then subsequent
              // backspaces will trigger the delete-previous behavior
            }
          } else if (key === 'Enter') {
            $scope.validateWord();
          }
        };
        
        $scope.moveToNext = function() {
          var allInputs = $element.closest('.inline-flex').find('.character-input');
          var nextInput = allInputs.eq($scope.index + 1);
          if (nextInput.length) {
            setTimeout(function() { nextInput.focus(); }, 0);
          }
        };
        
        $scope.moveToPrevious = function() {
          var allInputs = $element.closest('.inline-flex').find('.character-input');
          var prevInput = allInputs.eq($scope.index - 1);
          if (prevInput.length) {
            setTimeout(function() { prevInput.focus(); }, 0);
          }
        };
        
        $scope.deletePreviousAndMoveTo = function() {
          var allInputs = $element.closest('.inline-flex').find('.character-input');
          var prevInput = allInputs.eq($scope.index - 1);
          if (prevInput.length) {
            // Get the previous input's Angular scope and clear it
            var prevScope = angular.element(prevInput).scope();
            if (prevScope) {
              // Clear the input value
              prevScope.inputValue = '';
              // Reset validation state  
              prevScope.isValid = null;
              // Trigger validation to update the parent
              prevScope.validateCharacter();
              // Apply the changes
              if (!prevScope.$$phase) {
                prevScope.$apply();
              }
            }
            
            // Move focus to the previous input after a short delay
            setTimeout(function() { 
              prevInput.focus(); 
              // Also clear the DOM element value to be sure
              prevInput[0].value = '';
            }, 10);
          }
        };
        
        $scope.validateCharacter = function() {
          if ($scope.inputValue) {
            if ($scope.inputValue.toLowerCase() === $scope.character.toLowerCase()) {
              $scope.isValid = $scope.inputValue === $scope.character ? 'correct' : 'wrong-case';
            } else {
              $scope.isValid = 'wrong';
            }
            $scope.onCharacterChange({ index: $scope.index, value: $scope.inputValue, isValid: $scope.isValid });
            
            if ($scope.isValid === 'correct') {
              if ($scope.index < $scope.wordLength - 1) {
                // Move to next character in same word
                $scope.moveToNext();
              } else {
                // This is the last character, trigger word completion check
                setTimeout(function() {
                  $scope.onComplete();
                }, 50);
              }
            }
          } else {
            $scope.isValid = null;
            $scope.onCharacterChange({ index: $scope.index, value: "", isValid: null });
          }
        };
        
        $scope.validateWord = function() {
          $scope.onComplete();
        };
        
        $scope.getInputClasses = function() {
          var heightClass = 'h-10';
          var extraClasses = '';
          
          // Determine height based on character type
          if ($scope.character && $scope.mapping[$scope.character] !== undefined) {
            var charType = $scope.mapping[$scope.character];
            if (charType === 1) { // Ascenders (b, d, f, h, k, l, t, capitals)
              heightClass = 'h-14';
            } else if (charType === 2) { // Descenders (g, j, p, q, y)
              heightClass = 'h-14 pt-1';
            }
          }
          
          var baseClasses = 'character-input w-10 text-2xl font-medium text-center border-2 rounded-md bg-gray-50 transition-all duration-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ' + heightClass + extraClasses;
          
          if ($scope.isValid === 'correct') {
            return baseClasses + ' border-green-500 border-4 bg-green-100 text-green-800';
          } else if ($scope.isValid === 'wrong') {
            return baseClasses + ' border-red-500 border-4 bg-red-100 text-red-800';
          } else if ($scope.isValid === 'wrong-case') {
            return baseClasses + ' border-yellow-500 border-4 bg-yellow-100 text-yellow-800';
          }
          
          return baseClasses + ' border-gray-300';
        };

        $scope.$watch('inputValue', function(newVal, oldVal) {
          if (newVal !== oldVal) {
            $scope.validateCharacter();
          }
        });
      }
    };
  }]).directive("worddisplay", [function(){
  	return {
     	restrict: 'E',
  		scope: {
  			pair: "=",
  			visible: "=",
  			edit: "=",
  			resuj: "=",
  			finished: "=",
        num: "="
  		},
  		controller: function($scope, $element){
  			$scope.mapping = words;
  			$scope.inputArray = new Array();
  			$scope.errorCount = 0;
  			$scope.finished = false;
  			$scope.validationStates = new Array();

  			$scope.$watch("resuj", function(o,n){
  				console.log($scope.resuj);
  			});

        $scope.showArrow = function(index){
          return !!$scope.resuj && index == $scope.getCurrentInputPosition();
        };

        $scope.getCurrentInputPosition = function() {
          for(var i = 0; i < $scope.inputArray.length; i++) {
            if (!$scope.inputArray[i] || $scope.validationStates[i] !== 'correct') {
              return i;
            }
          }
          return $scope.inputArray.length;
        };

        $scope.onCharacterChange = function(index, value, isValid) {
          $scope.inputArray[index] = value;
          $scope.validationStates[index] = isValid;
          
          if (isValid === 'wrong') {
            $scope.errorCount++;
          }
          
          $scope.checkIfWordComplete();
        };

        $scope.onWordComplete = function() {
          if ($scope.isFinished()) {
            $scope.finished = true;
            // Wait for DOM to update before jumping to next word
            setTimeout(function() {
              $scope.focusNextWord();
            }, 200);
          }
        };

        $scope.focusNextWord = function() {
          // Find the current word's container (the div with ng-repeat)
          var currentWordDiv = $element.closest('.bg-white');
          var worksheetContainer = currentWordDiv.closest('.space-y-6');
          var allWordDivs = worksheetContainer.find('div.bg-white');
          var currentIndex = allWordDivs.index(currentWordDiv);
          
          // Find the next unfinished word
          for (var i = currentIndex + 1; i < allWordDivs.length; i++) {
            var wordDiv = allWordDivs.eq(i);
            
            // Look for character inputs in this word
            var characterInputs = wordDiv.find('.character-input');
            
            if (characterInputs.length > 0) {
              // This word has inputs, so it's not finished - focus on first input
              var firstInput = characterInputs.first();
              setTimeout(function() { 
                firstInput.focus(); 
              }, 50);
              return; // Found and focused on unfinished word
            }
          }
        };

  			$scope.isFinished = function(){
  				var word = $scope.pair.english;
  				for(var i = 0; i < word.length; i++){
  					if(!$scope.inputArray[i] || $scope.inputArray[i] !== word[i]){
  						return false;
  					}
  				}
  				return true;
  			};

        $scope.checkIfWordComplete = function() {
          if ($scope.isFinished()) {
            $scope.onWordComplete();
          }
        };

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
			};

      $scope.skip = function(c){
        return c == " " || words[c] == undefined;
      };

			$scope.classForWord = function(ind){
				if($scope.resuj){
					return $scope.validationStates[ind] || "";
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