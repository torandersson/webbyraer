

exports.bubblechart = function(request, response){


	var metric =request.query["metric"];

	response.render('bubblechart',{metric : metric});

}