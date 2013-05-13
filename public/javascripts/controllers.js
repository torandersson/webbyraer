'use strict';

/* Controllers */
function FacebookLikeCtrl($scope,restData,$filter,$rootScope) {
  
  $scope.popover = {
  "title" : "Friends",
  "content": "Hello Popover<br />This is a multiline message!",
  "saved": false
  };
  
  $scope.companies = [];
  $scope.companiesPreSearch = [];
  $scope.properties = [];
  $scope.orderProp = "likes";


  
  $scope.likesscrolled = function()
  {
            
  }

  /*$scope.mapOptions = {
    center: new google.maps.LatLng(59.324, 18.069423337342),
    zoom: 14,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        "stylers": [
          { "gamma": 0.26 },
          { "lightness": 40 },
          { "saturation": -86 },
          { "hue": "#0044ff" }
        ]
      }
    ]
  };*/

  restData.query(function(result) {
    $scope.companiesPreSearch = result;

  });

  $scope.ShowCompanyInformationModal = function(company) {
      $scope.activeCompany = company;
  };

  $scope.$watch("query",function() {
    if($scope.companies.length === 0)
      $scope.companies = $scope.companiesPreSearch
  });

  $scope.$on("loadedwork",function(){

    if($scope.companies.length === 0)
      $scope.companies = $scope.companiesPreSearch;
    
    for (var i = $scope.companies.length - 1; i >= 0; i--) {
       if($scope.works[$scope.companies[i].id]){
          $scope.companies[i].number_of_friends = $scope.works[$scope.companies[i].id].length;
          $scope.companies[i].friends = $scope.works[$scope.companies[i].id];
          $scope.companies[i].popover = $scope.CreatePopover($scope.works[$scope.companies[i].id])
        }
        else
          $scope.companies[i].number_of_friends = 0;

        
    };
  });

  $rootScope.$on('authed', function() {
      FB.api('/me/?fields=id,name,friends.fields(work,name)', function(response) {
              $scope.works = {};
              for (var i = 0; i < response.friends.data.length; i++) {
                var friend = response.friends.data[i];

                if(friend.work){
                  if($scope.works[friend.work[0].employer.id] == undefined)
                    $scope.works[friend.work[0].employer.id] = [];
                  $scope.works[friend.work[0].employer.id].push({id:friend.id,img:"http://graph.facebook.com/"+friend.id+"/picture?type=square"});
                }
              };




              $scope.$emit("loadedwork");
             //console.log("works",$scope.works);

      });
  });

  $scope.CreatePopover = function(arr){
    if(arr.length <= 0)
      return;
    var popover = {};
    popover.content = "";
    var pixels = 50;
    if(arr.length >= 4)
      pixels = 200;
    else
      pixels = arr.length * pixels;
     
    popover.content += "<div style='width:"+pixels+"px;'>";
    for (var i = arr.length - 1; i >= 0; i--) {
      popover.content +=  "<img style='width:50px; height:50px;' src='"+ arr[i].img+"'/>";
    };
    popover.content += "</div>"
    return popover;
  }

}