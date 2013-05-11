var facebookPages = require("../custom_node_modules/facebookPages.js");
var companyInfo = require("../custom_node_modules/pages.js");

exports.index = function(request, response){
	//find the company by name and take its id
	var hash = companyInfo.getAsHash();
	var info = hash[request.params.pagename.toLowerCase()];

	if(info == null)
		throw "Comnpany does not exist"
	facebookPages.getByIds([info.facebookid],getDate(),function(err,page){
		response.render('companydetail', {title: page[0].name, page: page[0] });
	});
}


var getDate = function(){
	var dateNow = new Date();
	var dd = dateNow.getDate();
	var monthSingleDigit = dateNow.getMonth() + 1,
    mm = monthSingleDigit < 10 ? '0' + monthSingleDigit : monthSingleDigit;
	var yy = dateNow.getFullYear().toString();

	var formattedDate = yy +'-'+ mm + '-' + dd;

	return formattedDate;
}
