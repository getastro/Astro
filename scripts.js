(function (document, window) {
	
	document.addEventListener('AstroWP-render', function (e) {
		
		$(window).ready(function() {
			$('body').fadeIn(500);
		});
		
		// Add responsive class to iframes
		// Add responsive class to iframes
		$("iframe, embed, object").wrap("<div class='embed-responsive embed-responsive-16by9'/>");
		$("iframe, embed, object, video").addClass('embed-responsive-item');
		
		// Add slider options
		$('.bxslider').bxSlider({
		  minSlides: 1,
		  maxSlides: 7,
		  slideWidth: 220,
		  slideMargin: 10
		});
		
    });
	
})(document, window);
