var facebookPages = require("../custom_node_modules/facebookPages.js");
var twitterAccounts = require("../custom_node_modules/twitterAccounts.js");
var pagesList = require("../custom_node_modules/pages.js");
var async = require('async');

/*
 * GET home page.
 */

exports.index = function(request, response){
	var list = pagesList.getIds("facebookid");
	var twitterList = pagesList.getIds("twitterid");
 	
 	var date = request.query["date"];

 	if(!date)
 	{
 		date = getDate();
 		
 	}

	// using async library to get information in parallell
	async.parallel({
    facebook: function(callback){
       facebookPages.getByIds(list,date,function(err,pages){
				var pagesArray = [];
				for(var id in pages){
				// 	pages[id] = handleUndefinedValues(pages[id]);
					pagesArray.push(pages[id]);
				}
				callback(null, pagesArray);
				 
			});
    },
    twitter: function(callback){
  		twitterAccounts.getByIds(twitterList,date,function(err,accounts){
				callback(null,accounts)
    	});
    }
	},
	
	function(err, results) {
    response.render('index', {title:"Webbyråer i Sverige",companies:pagesList.getAsHash(), pages: results.facebook,twitter_accounts:results.twitter});
	});
};

var getDate = function(){
	var dateNow = new Date();
	dateNow.setDate(dateNow.getDate()-1);
	var dd = dateNow.getDate();
	var monthSingleDigit = dateNow.getMonth() + 1
    , mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
	var yy = dateNow.getFullYear().toString();

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








