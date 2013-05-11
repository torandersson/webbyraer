var facebookPages = require("../custom_node_modules/facebookPages.js");
var twitterAccounts = require("../custom_node_modules/twitterAccounts.js");
var pagesList = require("../custom_node_modules/pages.js");
var async = require('async');
var cache = require('memory-cache');
/*
 * GET home page.
 */

exports.index = function(request, response){
	var list = pagesList.getIds("facebookid");
	var twitterList = pagesList.getIds("twitterid");
 	var dates = [];
 	var date = request.query["date"];

 	if(!date)
 	{
 		var from = new Date();
 		from.setDate(from.getDate()-1);
 		dates.push(getDate(from));
 		var tmpDate = new Date();
 		tmpDate.setDate(tmpDate.getDate()-2);
 		dates.push(getDate(tmpDate))
 	}

	// using async library to get information in parallell
	async.parallel({
    facebook: function(callback){
       facebookPages.getByIds(list,dates,function(err,pages){
				var pagesArray = [];
				for(var id in pages){
					pages[id] = handleUndefinedValues(pages[id]);
					pagesArray.push(pages[id]);
				}
				callback(null, pagesArray); 
			});
    },
    twitter: function(callback){
  		twitterAccounts.getByIds(twitterList,dates,function(err,accounts){
				callback(null,accounts)
    	});
    }
	},
	
	function(err, results) {
    var facebook = results.facebook;
    var picked1 = {};
    var picked2 = {};
    var to = new Date();
    to.setDate(to.getDate()-1);
    var compareDate = getDate(to);
    	
    for (var i = facebook.length - 1; i >= 0; i--) {
    	if(facebook[i].collected_at == compareDate){
    		picked2[facebook[i].id] = facebook[i];
    	}
    	else {
    		picked1[facebook[i].id] = facebook[i];
    	}
    };
    results.facebook = [];
    	
    for (var id in picked1) {
    	picked2[id].like_trend = picked2[id].likes - picked1[id].likes;
    	results.facebook.push(picked2[id]);
    };  	
      
    var concat = zipper(results.facebook,results.twitter);

    response.json(concat);
	});
};


var zipper = function(facebookList,twitterList){
	
	var hash = {};
	var results = [];
	var zip = pagesList.getAsHash();

	for (var i = 0; i < twitterList.length; i++) {
		hash[twitterList[i].screen_name.toLowerCase()] = twitterList[i];
	};
	
	for (var i = 0; i < facebookList.length; i++) {
		
		var result = facebookList[i];

		var twitterKey = zip[facebookList[i].id].twitterid;

		if(twitterKey && hash[twitterKey.toLowerCase()]){
			result.followers_count = hash[twitterKey.toLowerCase()].followers_count;
		}
		else
		{
			result.followers_count = 0;
		}

		results.push(result);

	};
	return results;
}

var getDate = function(date){
	var dd = date.getDate();
	var monthSingleDigit = date.getMonth() + 1
    , mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
	var yy = date.getFullYear().toString();

	var formattedDate = yy +'-'+ mm + '-' + dd;

	return formattedDate;
}

var handleUndefinedValues = function(page){
	var undefinedDefaults = {
		"checkins" : 0,
		"phone" : "Har inte fyllt i telefonnummer."
	};
	
	for(var propertyName in undefinedDefaults){
		if(page[propertyName] == undefined)
			page[propertyName] = undefinedDefaults[propertyName];
	}

    return page;
}








