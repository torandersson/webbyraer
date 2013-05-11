'use strict';

/* Directives */


var module = angular.module('myApp.directives', ['$strap.directives']);
  
  module.directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]);


/*module.directive('popover', function(){
    return function(scope,linkElement) {
        console.log("here",linkElement);
        linkElement.popover();
    };
});*/

