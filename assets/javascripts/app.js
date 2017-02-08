$(document).foundation();

// (function($) {
//     var element = $('.follow-scroll'),
//         originalY = element.offset().top;

//     // Space between element and top of screen (when scrolling)
//     var topMargin = 0;

//     // Should probably be set in CSS; but here just for emphasis
//     element.css('position', 'absolute');

//     $(window).on('scroll', function(event) {
//         var scrollTop = $(window).scrollTop();

//         element.stop(false, false).animate({
//             top: scrollTop < originalY
//                     ? 0
//                     : scrollTop - originalY + topMargin
//         }, 300);
//     });
// })(jQuery);


$('#read-intro').click(function() {
  $('#intro').animate({ 
    height: "toggle", 
    opacity: "toggle"
  });
});