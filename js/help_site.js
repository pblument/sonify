$(document).ready(function() {
	
	redrawDotNav();
	
	/* Scroll event handler */
    $(window).bind('scroll',function(e){
		redrawDotNav();
    });
    
	/* Next/prev and primary nav btn click handlers */
	$('a.sectionOne').click(function(){
    	$('html, body').animate({
    		scrollTop:0
    	}, 1000, function() {
		});
    	return false;
	});
    $('a.sectionTwo').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionTwo').offset().top
    	}, 1000, function() { 
		});
    	return false;
    });
    $('a.sectionThree').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionThree').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionFour').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionFour').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionFive').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionFive').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionSix').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionSix').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionSeven').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionSeven').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionEight').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionEight').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionNine').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionNine').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	$('a.sectionTen').click(function(){
    	$('html, body').animate({
    		scrollTop:$('#sectionTen').offset().top
    	}, 1000, function() {
		});
    	return false;
    });
	
    /* Show/hide dot lav labels on hover */
    $('nav#primary a').hover(
    	function () {
			$(this).prev('h1').show();
		},
		function () {
			$(this).prev('h1').hide();
		}
    );
	
    
});


/* Set navigation dots to an active state as the user scrolls */
function redrawDotNav(){
	
	var section1Top =  0;
	// The top of each section is offset by half the distance to the previous section.
	var section2Top =  $('#sectionTwo').offset().top - (($('#sectionThree').offset().top - $('#sectionTwo').offset().top) / 2);
	var section3Top =  $('#sectionThree').offset().top - (($('#sectionFour').offset().top - $('#sectionThree').offset().top) / 2);
	var section4Top =  $('#sectionFour').offset().top - (($('#sectionFive').offset().top - $('#sectionFour').offset().top) / 2);
	var section5Top =  $('#sectionFive').offset().top - (($('#sectionSix').offset().top - $('#sectionFive').offset().top) / 2);
	var section6Top =  $('#sectionSix').offset().top - (($('#sectionSeven').offset().top - $('#sectionSix').offset().top) / 2);
	var section7Top =  $('#sectionSeven').offset().top - (($('#sectionEight').offset().top - $('#sectionSeven').offset().top) / 2);
	var section8Top =  $('#sectionEight').offset().top - (($('#sectionNine').offset().top - $('#sectionEight').offset().top) / 2);
	var section9Top =  $('#sectionNine').offset().top - (($('#sectionTen').offset().top - $('#sectionNine').offset().top) / 2);
	var section10Top =  $('#sectionTen').offset().top - (($(document).height() - $('#sectionTen').offset().top) / 2);
	$('nav#primary a').removeClass('active');
	if($(document).scrollTop() >= section1Top && $(document).scrollTop() < section2Top){
		$('nav#primary a.sectionOne').addClass('active');
	} else if ($(document).scrollTop() >= section2Top && $(document).scrollTop() < section3Top){
		$('nav#primary a.sectionTwo').addClass('active');
	} else if ($(document).scrollTop() >= section3Top && $(document).scrollTop() < section4Top){
		$('nav#primary a.sectionThree').addClass('active');
	} else if ($(document).scrollTop() >= section4Top && $(document).scrollTop() < section5Top){
		$('nav#primary a.sectionFour').addClass('active');
	} else if ($(document).scrollTop() >= section5Top && $(document).scrollTop() < section6Top){
		$('nav#primary a.sectionFive').addClass('active');
	} else if ($(document).scrollTop() >= section6Top && $(document).scrollTop() < section7Top){
		$('nav#primary a.sectionSix').addClass('active');
	} else if ($(document).scrollTop() >= section7Top && $(document).scrollTop() < section8Top){
		$('nav#primary a.sectionSeven').addClass('active');
	} else if ($(document).scrollTop() >= section8Top && $(document).scrollTop() < section9Top){
		$('nav#primary a.sectionEight').addClass('active');
	} else if ($(document).scrollTop() >= section9Top && $(document).scrollTop() < section10Top){
		$('nav#primary a.sectionNine').addClass('active');
	} else if ($(document).scrollTop() >= section10Top){
		$('nav#primary a.sectionTen').addClass('active');
	}
	
}
