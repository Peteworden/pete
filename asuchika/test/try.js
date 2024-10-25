let currentSlide = 1;
let timeoutID;

$(document).ready(function(){
    var $prev = $('.slideshow__nav_link--is-previous');
    var $next = $('.slideshow__nav_link--is-next');
    var mode = "auto";
    $prev.on({
        click: function(e){
            e.preventDefault();
            mode = "manual";
            showPreviousImage();
        }
    });
    $next.on({
        click: function(e){
            e.preventDefault();
            mode = "manual";
            showNextImage();
        }
    });
    
    setInterval( function(){
        if(mode === "auto"){
            showNextImage();
        }
    }, 5000);
    
    function showNextImage(){
        var $actEl = $('.slideshow__slide--is-active');
        var $nextEl = $actEl.next('.slideshow__slide');
        if($nextEl.length){
            $actEl.removeClass('slideshow__slide--is-active');
            $nextEl.addClass('slideshow__slide--is-active');
        }else{
            $actEl.removeClass('slideshow__slide--is-active');
            $('.slideshow__slide:first-child').addClass('slideshow__slide--is-active');
        }
    }
    
    function showPreviousImage(){
        var $actEl = $('.slideshow__slide--is-active');
        var $prevEl = $actEl.prev('.slideshow__slide');
        if($prevEl.length){
            $actEl.removeClass('slideshow__slide--is-active');
            $prevEl.addClass('slideshow__slide--is-active');
        }else{
            $actEl.removeClass('slideshow__slide--is-active');
            $('slideshow__slide--is-last').addClass('slideshow__slide--is-active');
        }
    }
});