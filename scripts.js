(function (document, window) {
	
	document.addEventListener('AstroAPI-render', function (e) {
		
		$(window).ready(function() {
			$('body').fadeIn(500);
		});
		
		// Add responsive class to iframes
		$("iframe, embed, object").wrap("<div class='embed-responsive embed-responsive-16by9'/>");
		$("iframe, embed, object, video").addClass('embed-responsive-item');
		
		// Optimized images
		$('.img-thumbnail').attr("src", function(i, src) {
		  return src + '?w=50';
		});
		
		// Add slider options
		$('.bxslider').bxSlider({
		  minSlides: 2,
		  maxSlides: 7,
		  slideWidth: 220,
		  slideMargin: 10,
		  controls: false
		});
		
    });
	
})(document, window);
