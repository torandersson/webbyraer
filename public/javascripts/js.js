

$('.openModal').click(function (e) {
	alert("hej");
   	e.preventDefault();
    $('body').css({
       
        overflow : 'hidden'
        background-color : 'white'

    });
     $('#example').css({
       
        overflow : 'scroll'
        background-color : 'white'

    });
});


$('.modalDialog a').click(function (e) {
    $('body').css({
       
        overflow : 'scroll'

    });
});