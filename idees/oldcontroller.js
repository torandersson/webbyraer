'use strict';

/* Controllers */


function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];


function FacebookLikeCtrl($scope,FacebookLikes,$filter) {
   console.log("loaded FacebookLikeCtrl");
   $scope.companies = [];
   $scope.companiesPreSearch = [];

   $scope.properties = [];

   $scope.filterLikes = "likes";
   $scope.talkingAboutCount = "talking_about_count"
   $scope.checkins = "checkins";

   $scope.wereHereCount = "were_here_count";
   $scope.myMarkers = [];
   

   $scope.mapOptions = {
  		center: new google.maps.LatLng(59.324, 18.069423337342),
  		zoom: 14,
  		mapTypeId: google.maps.MapTypeId.ROADMAP,
  		styles: [
  {
    "stylers": [
      { "visibility": "simplified" },
      { "saturation": 7 },
      { "lightness": 9 },
      { "hue": "#f6ff00" }
    ]
  }
]
	};

   $scope.facebookLikes = FacebookLikes.get(function(result) {
   		
      var likes = result.facebook;
      $scope.orderProp = "likes";
      $scope.companiesPreSearch = likes;
   		var index = 0;
   		for(var propertyName in likes){

   			if(likes[propertyName].location) {
	   			$scope.myMarkers.push(new google.maps.Marker({
	    			map: $scope.myMap,
	    			position: new google.maps.LatLng(likes[propertyName].location.latitude, likes[propertyName].location.longitude),
	  				id : likes[propertyName].id,
	  				name : likes[propertyName].name
	  			}));
   			}
   		}
      
      var bounds = new google.maps.LatLngBounds();
      // Extend bounds with each point
      for (var ii = 0; ii < $scope.myMarkers.length; ii++) {
        bounds.extend($scope.myMarkers[ii].getPosition());
      }

      // Apply fitBounds
      $scope.myMap.fitBounds(bounds);
   	});

    $scope.$watch("query",function() {
    	var query = $filter("filter");

      if($scope.companies.length == 0)
        $scope.companies = $scope.companiesPreSearch

    	var list = query($scope.companies,$scope.query);
    	var last = null;
    	for (var i = $scope.myMarkers.length - 1; i >= 0; i--) {
    	   $scope.myMarkers[i].setVisible(false);
    		for (var j = list.length - 1; j >= 0; j--) {
    		    
		    	if(list[j].location != undefined && $scope.myMarkers[i] != undefined) {
			   	    if(list[j].id === $scope.myMarkers[i].id)
		    		{
		    			
			   			$scope.myMarkers[i].setVisible(true);
			   			last = $scope.myMarkers[i];
			   		}

		   		}
	   		
   			};
    	};

      
      var bounds = new google.maps.LatLngBounds();
        // Extend bounds with each point
      for (var ii = 0; ii < $scope.myMarkers.length; ii++) {
        if($scope.myMarkers[ii].getVisible())
          bounds.extend($scope.myMarkers[ii].getPosition());
      }

      // Apply fitBounds
       $scope.myMap.fitBounds(bounds);
    });

    $scope.openMarkerInfo = function(marker) {
  		$scope.currentMarker = marker;
  		$scope.currentMarkerLat = marker.getPosition().lat();
  		$scope.currentMarkerLng = marker.getPosition().lng();
  		$scope.myInfoWindow.open($scope.myMap, marker);
	};



}