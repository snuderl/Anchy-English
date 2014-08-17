'use strict';

angular.module('myApp.controllers').controller('WorksheetCtrl', ["$scope", "$http", "$routeParams", "$location", "Worksheet", "Word", "Category", function($scope, $http, $routeParams, $location, Worksheet, Word, Category) {
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
        $scope.words.push(d);
      }
    });

    $scope.visible = true;
    $scope.printMode = false;
    $scope.editMode = false;
    $scope.resuj = false;
    $scope.finished = new Array();
    $scope.category = "";
    $scope.categories = Category.query();
    $scope.words = [];

    $scope.chooseWord = function(item, model, label){
      $scope.word.english = item.english;
      $scope.word.slovene = item.slovene;
    };

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
       $scope.finishedCount() == $scope.worksheet.words.length;
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

    $scope.canSave = function(){
      console.log($scope.worksheet.words.length);
      return !!$scope.worksheet.ime && $scope.worksheet.words.length > 0;
    }

    $scope.save = function(){
      if(!$scope.canSave()){
        return;
      }


      if($routeParams.id){
          Worksheet.save({id: $routeParams.id}, $scope.worksheet, function(data){
            $scope.editMode = false;
          });
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