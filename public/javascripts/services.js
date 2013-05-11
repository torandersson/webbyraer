'use strict';

/* Services */



angular.module('myApp.services', ['ngResource']).
  factory('restData', function($resource){
    
    return $resource('/rest/companies', {}, {
    
      query: {method:'GET', params:{exerciseId:'all'}, isArray:true},
    
       get: {method:'GET', params:{ids:'all'}}
    
    });

});


angular.module('myApp.facebook',[]).
	factory('Facebook', function($rootScope) {

    var self = this;
    
    this.auth = null;

    return {

      getAuth: function() {
        return self.auth;
      },

      login: function() {

        FB.login(function(response) {
     
          if (response.authResponse) {
     
            self.auth = response.authResponse;
            $rootScope.$emit('authed', FB);
            
     
          } else {
     
            console.log('Facebook login failed', response);
     
          }
        },{scope: 'friends_work_history,user_likes'})

      },

      logout: function() {

        FB.logout(function(response) {
     
          if (response) {
     
            self.auth = null;
     
          } else {
     
            console.log('Facebook logout failed.', response);
     
          }

        })

      }
    }

  });
