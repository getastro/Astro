(function (document, window) {
	
	document.addEventListener('AstroWP-render', function (e) {
		
		$(window).ready(function() {
			$('body').fadeIn(500);
		});
		
		// Add responsive class to iframes
		$("iframe, embed, object").wrap("<div class='flex-video widescreen'/>");
		
		// Add slider options
		$('.bxslider').bxSlider({
		  minSlides: 1,
		  maxSlides: 7,
		  slideWidth: 220,
		  slideMargin: 10
		});
		
    });
	
})(document, window);
