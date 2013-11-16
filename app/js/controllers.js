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
      console.log("call");
      if($scope.canAdd()){
        $http.get("/addWord/"+$scope.eng+"/"+$scope.slovene).success(function(data){
          $scope.dictionary = data;
        });
        $scope.words.push({
          "word": $scope.eng,
          "visible": false
        });
      }
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
        ime: $scope.worksheet.ime
      };

      var url = "worksheet/save/";
      if($routeParams.id){
        url += $routeParams.id;
      }
      $http.post(url, data).success(function(data){
        $location.path("/view1/" + data.id);
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

  $scope.resuj = function(){
    $location.search({mode: "resuj"});
  };

  $scope.loadData();


  }])
  .controller('MyCtrl2', ["$scope", "$http", function($scope, $http) {
    $scope.worksheets = [];

    $scope.getWorksheets = function(){
        $http.get("/worksheet/").success(function(data){
          $scope.worksheets = data;
        });
    };

    $scope.getWorksheets();
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