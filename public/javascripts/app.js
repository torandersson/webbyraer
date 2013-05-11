'use strict';


// Declare app level module which depends on filters, and services
var app = angular.module('myApp', ['myApp.filters','myApp.facebook', 'myApp.services','ui.directives', 'myApp.directives','myApp.services']).
  config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({redirectTo: '/view1'});
  }]);


app.run(function($rootScope, Facebook) {

  $rootScope.Facebook = Facebook;

})
