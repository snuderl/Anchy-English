'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', [
  'ngRoute',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'myApp.controllers',
  "contenteditable"
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1/:id', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view1', {templateUrl: 'partials/partial1.html', controller: 'MyCtrl1'});
  $routeProvider.when('/view2', {templateUrl: 'partials/partial2.html', controller: 'MyCtrl2'});
  $routeProvider.otherwise({redirectTo: '/view1'});
}]).factory('squareDrawer', function() {
    var registry = {};


});

/**
 * @see http://docs.angularjs.org/guide/concepts
 * @see http://docs.angularjs.org/api/ng.directive:ngModel.NgModelController
 * @see https://github.com/angular/angular.js/issues/528#issuecomment-7573166
 */

angular.module('contenteditable', [])
  .directive('contenteditable', ['$timeout', function($timeout) { return {
    restrict: 'A',
    require: '?ngModel',
    link: function($scope, $element, attrs, ngModel) {
      // don't do anything unless this is actually bound to a model
      if (!ngModel) {
        return
      }

      // view -> model
      $element.bind('input', function(e) {
        $scope.$apply(function() {
          var html, html2, rerender
          html = $element.html()
          rerender = false
          if (attrs.stripBr && attrs.stripBr !== "false") {
            html = html.replace(/<br>$/, '')
          }
          if (attrs.noLineBreaks && attrs.noLineBreaks !== "false") {
            html2 = html.replace(/<div>/g, '').replace(/<br>/g, '').replace(/<\/div>/g, '')
            if (html2 !== html) {
              rerender = true
              html = html2
            }
          }
          ngModel.$setViewValue(html)
          if (rerender) {
            ngModel.$render()
          }
          if (html === '') {
            // the cursor disappears if the contents is empty
            // so we need to refocus
            $timeout(function(){
              $element[0].blur()
              $element[0].focus()
            })
          }
        })
      })

      // model -> view
      var oldRender = ngModel.$render
      ngModel.$render = function() {
        var el, el2, range, sel
        if (!!oldRender) {
          oldRender()
        }
        $element.html(ngModel.$viewValue || '')
        el = $element[0]
        range = document.createRange()
        sel = window.getSelection()
        if (el.childNodes.length > 0) {
          el2 = el.childNodes[el.childNodes.length - 1]
          range.setStartAfter(el2)
        } else {
          range.setStartAfter(el)
        }
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
      if (attrs.selectNonEditable && attrs.selectNonEditable !== "false") {
        $element.bind('click', function(e) {
          var range, sel, target
          target = e.toElement
          if (target !== this && angular.element(target).attr('contenteditable') === 'false') {
            range = document.createRange()
            sel = window.getSelection()
            range.setStartBefore(target)
            range.setEndAfter(target)
            sel.removeAllRanges()
            sel.addRange(range)
          }
        })
      }
    }
  }}])