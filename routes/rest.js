var facebookPages = require("../custom_node_modules/facebookPages.js");
var twitterAccounts = require("../custom_node_modules/twitterAccounts.js");
var pagesList = require("../custom_node_modules/pages.js");
var dateService = require("../custom_node_modules/dateService.js");
var async = require('async');
var cache = require('memory-cache');
var _ = require("underscore");
/*
 * GET home page.
 */

exports.index = function(request, response){
	var facebookIds = pagesList.getIds("facebookid")
	  , twitterIds = pagesList.getIds("twitterid")
 	  , dates = []
 	  , date = request.query["date"];
 	
 	var dateOne = dateService.GetDate();
 	 	
 	dateOne.setDate(dateOne.getDate()-1);
 	var dateTwo = dateService.GetDate();
 	dateTwo.setDate(dateTwo.getDate()-2);
 	
 	dateOne = getDate(dateOne);
 	dateTwo = getDate(dateTwo);

	// using async library to get information in parallell
	async.parallel({
    	facebook: function(callback) {
      		facebookPages.getByIds(facebookIds,[dateOne,dateTwo],function(err,pages) {	
				var pagesArray = _.map(pages,handleUndefinedValues);
				callback(null, pagesArray); 
			});
    	},
    	twitter: function(callback){
  			twitterAccounts.getByIds(twitterIds,[dateOne,dateTwo],function(err,accounts){
				callback(null,accounts)
    		});
    	}
	},
	
	function(err, results) {
	    var facebook = results.facebook;
	    	    
	    results.facebook = [];

	    var groupedPages = _.groupBy(facebook, function(page){ return page.id });

	    for(var id in groupedPages)
	    {
	    	var facebookPages =	groupedPages[id];

	    	if(facebookPages.length == 2)
	    	{
	    		var first = facebookPages[0].collected_at == dateOne ? facebookPages[0] : facebookPages[1],
	    			second = facebookPages[0].collected_at != dateOne ? facebookPages[0] : facebookPages[1]

	    		first.like_trend = first.likes - second.likes;

	    		results.facebook.push(first);
	    	}
	    }

	    var concat = zipper(results.facebook,results.twitter);

	    response.json(concat);
	});
};

var zipper = function(facebookList,twitterList){
	
	var hash = {}
	  , results = []
	  , zip = pagesList.getAsHash();

	hash = toDictionary(twitterList,function(item) { return item.screen_name.toLowerCase() });
	
	for (var i = 0; i < facebookList.length; i++) {
		
		var result = facebookList[i]
		  , twitterKey = zip[facebookList[i].id].twitterid || ""
		  , twitterKey = twitterKey.toLowerCase()
		  , twitterAccount = hash[twitterKey];
		 
		result.followers_count = 0;

		if(twitterAccount){
			result.followers_count = twitterAccount.followers_count;
		}
	
		results.push(result);

	};

	return results;
}

var toDictionary = function(list,fn)
{
	var result = {};
    fn = fn || function () {};
    for (var i = list.length - 1; i >= 0; i--) {
	   result[fn(list[i])] = list[i];
	};
	return result;
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








