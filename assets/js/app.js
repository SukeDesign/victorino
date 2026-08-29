/****************************************************
 *  start jquery functions after loading
 *  susana@busy-rooms 20180717
 ****************************************************/
$(document).ready(function(){    

    // for ie bugs solved with css
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");
    var edge = ua.indexOf("Edge");
    var moz = ua.indexOf("Firefox");
    var safari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        $('body').addClass('ie');
    };
    if (edge > 0) {
        $('body').addClass('ie edge');
    };
    if (moz > 0){
        $('body').addClass('moz');    
    };
    if (safari > 0){
        $('body').addClass('safari');    
    };


    /******************** Date Picker ********************/
    var months = 2;

    if ($(window).width() < 1000) {
        var months = 1;
    };
    // btn-scroll-up in footer
    $('.scroll-to-top').on('click', function(e){
        $('html,body').animate({ scrollTop: $('main').offset().top }, 'slow');
    });

    // WEB-3195 | show bookingbar on an overlay
    $( ".btn-overlay, .booking-close-trigger" ).click(function() {
        $( ".overlay-booking" ).slideToggle( "fast" );
    });

    $(window).on('scroll', function() {
        var body = $('body');
        if ($(document).scrollTop() > 150 ) {
            $(body).addClass('scroll'); 
        }
        else {
            $(body).removeClass('scroll');
        }
    });// on window scroll

    $('.side-sub-menu').on('shown.bs.collapse', function () {
        $(this).parent('li.has-collapse').addClass('active');
    });
    $('.side-sub-menu').on('hidden.bs.collapse', function () {
        $(this).parent('li.has-collapse').removeClass('active');
    });

    // testimonials slick 
    if ( $('.slick-one .slick-item').length > 1 ) { 
        $('.slick-one').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            dots: true,
            arrows: false
        });
    };

    /* if find three-items slick with more then 3 items */
    if ( $('.three-items .card').length > 3 ) { 
        $('.three-items').attr('dir', 'ltr');
        $('.three-items').slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,   
            slidesToShow: 3,
            slidesToScroll: 1,
            dots: true,
            arrows: true,
            rtl: false,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false
                    }
                }
            ]
        });
    };
    /* services | if find four-items slick with more then 4 items */
    if ( $('.four-items .card').length > 4 ) { 
        $('.four-items').attr('dir', 'ltr');
        $('.four-items').slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 5000,   
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            rtl: false,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false
                    }
                }
            ]
        });
    };
    /* awards | if find six-items slick with more then 6 items */
    if ( $('.six-items .slick-item').length > 6 ) { 
        $('.six-items').attr('dir', 'ltr');
        $('.six-items').slick({
            infinite: true,
            autoplay: true,
            autoplaySpeed: 6000,   
            slidesToShow: 6,
            slidesToScroll: 3,
            dots: true,
            arrows: false,
            rtl: false,
            responsive: [
                {
                    breakpoint: 800,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false
                    }
                }
            ]
        });
    };

    // for lightbox event with ekko-lightbox
    $(document).on('click', '[data-toggle="lightbox"]', function(event) {
        event.preventDefault();
        $(this).ekkoLightbox();
    });

    // WEB-535 | for new parallax to work with focuspoint
    if ( $('.parallax-window').length > 0 ) {

        $width = $(window).width();
        $height = $(window).height();

        $('.parallax-window').parallax({
            naturalWidth: $width,
            naturalHeight: $height
        });
        $('.parallax-mirror').css({'visiblity':'visible','z-index':1});

        if($width <= 414){
            $('.parallax-slider').css({'transform':'translate3d(0px, 0px, 0px)','position':'absolute','width':'100%','height':240});
        };
    };

    // start animated fadeInDown for all displays and teasers
    $('main [data-method="teaser"] .card:odd').addClass('wow bounceInDown');
    $('main [data-method="teaser"] .card:even').addClass('wow bounceInUp');
    $('main .blockquote-block').addClass('wow slideInUp');
    $('main article[data-method="text"] h5').addClass('wow bounceInRight');
    $('main article[data-method="text"] h2').addClass('wow bounceInLeft');
    $('main .price, main .date').addClass('wow zoomIn');
    new WOW().init();

    /******************** Date Picker ********************/
    // Booking Bar
    $( function() {
        $('.date-arrival').datepicker();
        $('.date-departure').datepicker();
    });
    /******************** END Date Picker ********************/
});