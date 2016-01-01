(function (document, window) {
	
	document.addEventListener('AstroWP-render', function (e) {
		
		$(window).ready(function() {
			$('body').fadeIn(500);
		});
		
		$('.bxslider').bxSlider({
		  minSlides: 1,
		  maxSlides: 7,
		  slideWidth: 220,
		  slideMargin: 10
		});
		
    });
	
})(document, window);
