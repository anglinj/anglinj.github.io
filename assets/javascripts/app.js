$(document).foundation();

$(window).scroll(function(e){
  parallax();
});

function parallax(){
  var scrolled = $(window).scrollTop();
  $('.top-img').css('background-position','center ' + -(scrolled*0.35)+'px');
}
