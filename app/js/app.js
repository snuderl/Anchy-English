'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  "contenteditable",
  "RecursionHelper",
  "ui.bootstrap"
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/worksheets/new', {templateUrl: 'partials/partial1.html', controller: 'WorksheetCtrl'});
  $routeProvider.when('/worksheets/:id', {templateUrl: 'partials/partial1.html', controller: 'WorksheetCtrl'});
  $routeProvider.when('/worksheets', {templateUrl: 'partials/partial2.html', controller: 'WorksheetsCtrl'});
  $routeProvider.when('/categories/:id', {templateUrl: 'partials/partial3.html', controller: 'CategoriesCtrl'});
  $routeProvider.when('/categories', {templateUrl: 'partials/partial3.html', controller: 'CategoriesCtrl'});
  $routeProvider.otherwise({redirectTo: '/worksheets'});
}]);

