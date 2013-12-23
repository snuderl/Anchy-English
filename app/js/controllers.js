'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', ["$scope", "$http", "$routeParams", "$location", function($scope, $http, $routeParams, $location) {
  	$scope.words = [];

    $scope.worksheet = {};

    $scope.dictionary = [];

    $http.get("/words/all").success(function(data){
      $scope.dictionary = data;
    });

  	$scope.$watch("words", function(newValue, oldValue){
  		for(var i=1; i < newValue.length; i++){
  			squareDrawer.draw(50, 50, newValue[i].en);
  		}
  	});

    $scope.slovene = "";
    $scope.eng = "";
    $scope.visible = true;
    $scope.printMode = false;
    $scope.editMode = false;
    $scope.resuj = false;
    $scope.finished = new Array();
    $scope.category = "";




    $scope.removeCategory = function(category){
      var index = $scope.worksheet.categories.indexOf(category);
      if(index > -1){
        $scope.worksheet.categories.splice(index, 1);
      }
    }

    $scope.addCategory = function(){
      var value = $scope.category;
      if(value != "" && $scope.worksheet.categories.indexOf(value) == -1){
        $scope.worksheet.categories.push(value);
      }
      $scope.category = "";
    }

    $scope.isFinished = function(){
    	return $scope.resuj() &&
    	 $scope.finishedCount == $scope.words.length;
    }

    $scope.finishedCount = function(){
      var k = 0;
      for(var i = 0; i<$scope.finished.length;i++){
        if($scope.finished[i]){
          k++;
        }
      }
      return k;
    };

    $scope.edit = function(){
      $scope.editMode = !$scope.editMode;
    }

    $scope.remove = function(index){
      $scope.words.splice(index, 1);
    }

    $scope.print = function(){
      $location.search({mode: "print"});
    };

    $scope.row = function(ind, el){
      if(ind == 1){
        var r = [];
        for(var i = 0; i < el.length; i++){
          r.push(el[i]);
        }
      }else if(ind == 2){
        var r = [];
        for(var i = 0; i < el.length; i++){
          if($scope.mapping[el[i]] != 1){
            r.push(el[i]);
          }
        }
      }
      else{
        var r = [];
        for(var i = 0; i < el.length; i++){
          if($scope.mapping[el[i]] != 2){
            r.push(el[i]);
          }
        }

      }

      return r;
    };  

    $scope.toggleAnswers = function(){
      $scope.visible = !$scope.visible;
      console.log($scope.visible);
    };

    $scope.addWord = function(){
      $scope.dictionary[$scope.eng] = $scope.slovene;
      $scope.words.push({
        "word": $scope.eng,
        visible: false
      });

      $scope.eng = "";
      $scope.slovene = "";
    };

    $scope.canAdd = function(){
      return $scope.slovene != "" && $scope.eng != "";
    };

    $scope.results = [];

    $scope.$watch("eng", function(n, old){
      console.log(n);
      if(n == ""){
        $scope.results = [];
      }else{
        $scope.calculateResults($scope.dictionary);
      }
    })

    $scope.calculateResults = function(dictionary) {
      $scope.results = [];
      for(var prop in dictionary){
        if(prop.indexOf($scope.eng) != -1){
          $scope.results.push([prop, dictionary[prop]]);
        }
      }
      console.log($scope.results);
    };

    $scope.fill = function(eng, slovene){
      $scope.eng = eng;
      $scope.slovene = slovene;
    };

    $scope.save = function(){
      if(!$scope.worksheet.ime || $scope.worksheet.ime==""){
        return;
      }

      var data = [];
      for(var i = 0; i< $scope.words.length; i++){
        var word = $scope.words[i].word;
        var ob = {};
        ob[word] = $scope.dictionary[word];
        data.push(ob);
      }

      data = {
        words: data,
        ime: $scope.worksheet.ime,
        categories: $scope.worksheet.categories
      };

      var url = "worksheet/save/";
      if($routeParams.id){
        url += $routeParams.id;
      }
      $http.post(url, data).success(function(data){
        $location.path("/worksheets/" + data.id);
      });

      $scope.editMode = false;
    };


  $scope.loadData = function(){
    if($routeParams.id){
      var url = "/worksheet/" + $routeParams.id;
      $http.get(url).success(function(data){
            $scope.worksheet = data.worksheet;
            $scope.words = [];
            for(var prop in data.words){
              console.log(prop);
              $scope.words.push({
                "word": prop,
                "visible": false,
                "input": prop.replace(/./g, " ")
              });
            }
        });
    }
    else{
      $scope.editMode = true;
      $scope.worksheet = {
        ime: "Naslov"
      };
    }

    if($routeParams.mode == "print"){
      $scope.printMode = true;
      $scope.visible = false;
      $(".menu").hide();
    }
    else if($routeParams.mode == "resuj"){
      $scope.resuj = true;
      $scope.visible = false;
      $scope.editMode = false;
    }
    else{
      $scope.printMode = false;
    }
  };

  $scope.resujButton = function(){
    $location.search({mode: "resuj"});
  };

  $scope.loadData();


  }])
  .controller('MyCtrl2', ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
    $scope.worksheets = [];
    $scope.category = null;

    $scope.getWorksheets = function(){
        $http.get("/worksheet/").success(function(data){
          $scope.worksheets = data.worksheets;
          $scope.categories = data.categories;
        });
    };

    $scope.loadData = function()
    {
      $scope.getWorksheets();
      if($routeParams.category){
        $scope.category = $routeParams.category;
        $scope.worksheets = $scope.filterWorksheets($scope.category);
      }
    }

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
  }]).controller('MyCtrl3', ["$scope", "$http", "$routeParams", function($scope, $http, $routeParams) {
    $scope.worksheets = [];
    $scope.category = null;

    $scope.getWorksheets = function(){
        $http.get("/worksheet/").success(function(data){
          $scope.worksheets = data.worksheets;
          $scope.categories = data.categories;
        });
    };

    $scope.loadData = function()
    {
      $scope.getWorksheets();
      if($routeParams.category){
        $scope.category = $routeParams.category;
        $scope.worksheets = $scope.filterWorksheets($scope.category);
      }
    }

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

var dictionary = {"hair": "lasje", "table": "miza"};

  var squareDrawer = {
        /**
         * draw the square on the canvas
         */
        draw: function(height, width, id) {
            console.log("square to draw: " + height + "x" + width + " " + id);

            var canvas = document.getElementById(id);
            if (canvas && canvas.getContext) {
                console.log("drawing");
                var ctx = canvas.getContext("2d");
                //clear the canvas
                ctx.clearRect(0,0, canvas.width, canvas.height);

                ctx.fillRect(0, 0, width, height);
            }
        }
};

