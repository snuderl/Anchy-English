'use strict';

angular.module('myApp.controllers').controller('WorksheetCtrl', ["$scope", "$http", "$routeParams", "$location", "Worksheet", "Word", function($scope, $http, $routeParams, $location, Worksheet, Word) {
    $scope.words = [];
    $scope.word = {
      english: "",
      slovene: ""
    };

    $scope.dictionary = {};

    Word.query(function(data) {
      $scope.dictionary = {};

      for(var i = 0; i < data.length; i++){
        var d = data[i];
        $scope.dictionary[d.english] = d;
      }
    });

    $scope.$watch("words", function(newValue, oldValue){
      for(var i=1; i < newValue.length; i++){
        squareDrawer.draw(50, 50, newValue[i].en);
      }
    });

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
        $scope.worksheet.categories.push({name: value, parent: ""});
      }
      $scope.category = "";
    }

    $scope.isFinished = function(){
      return $scope.resuj &&
       $scope.finishedCount() == $scope.words.length;
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
      $scope.worksheet.words.splice(index, 1);
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
    };

    $scope.addWord = function(){
      if(!$scope.dictionary[$scope.word.english]){ 
        $scope.dictionary[$scope.word.english] = $scope.word;
      }

      $scope.worksheet.words.push($scope.word);

      $scope.word = {
        english: "",
        slovene: ""
      };
    };

    $scope.canAdd = function(){
      return $scope.word.slovene != "" && $scope.word.eng != "";
    };

    $scope.results = [];

    $scope.$watch("word.english", function(n, old){
      if(n == ""){
        $scope.results = [];
      }else{
        $scope.calculateResults($scope.dictionary);
      }
    })

    $scope.delete = function(){
      var url = "worksheet/" + $routeParams.id;
      $http.delete(url).success(function(data){
        $location.path("/worsheets");
      });
    }

    $scope.calculateResults = function(dictionary) {
      $scope.results = [];
      for(var prop in dictionary){
        if(prop.indexOf($scope.word.english) != -1){
          $scope.results.push(dictionary[prop]);
        }
      }
    };

    $scope.selectWord = function(word){
      $scope.word.english = word.english;
      $scope.word.slovene = word.slovene;
    };

    $scope.save = function(){
      if(!$scope.worksheet.ime || $scope.worksheet.ime==""){
        return;
      }

      console.log($scope.worksheet);
      if($routeParams.id){
          Worksheet.save({id: $routeParams.id}, $scope.worksheet);
      }else{
        $scope.worksheet.$save().then(function(data){
          $location.path("/worksheets/" + data.id);
        });
      }

    };


  $scope.loadData = function(){
    if($routeParams.id){
      Worksheet.get({ id: $routeParams.id }, function(data){
        $scope.worksheet = data;
      });
      // var url = "/worksheet/" + $routeParams.id;
      // $http.get(url).success(function(data){
      //       $scope.worksheet = data.worksheet;
      //       $scope.words = [];
      //       for(var prop in data.words){
      //         console.log(prop);
      //         $scope.words.push({
      //           "word": prop,
      //           "visible": false,
      //           "input": prop.replace(/./g, " ")
      //         });
      //       }
      //   });
    }
    else{
      $scope.editMode = true;
      $scope.worksheet = new Worksheet();
      $scope.worksheet.words = [];
      $scope.worksheet.categories = [];
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
  }]);