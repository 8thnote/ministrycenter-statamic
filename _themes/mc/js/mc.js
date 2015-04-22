$(document).ready(function() {
	"use strict";
	function debounce(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this,
				args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}; //debounce fn
 
    var initialized = false;
    var myScene;
    
	var myResize = function() {
	    var el = document.getElementById('mainWrap');
    	var fontPx = window.getComputedStyle(el, null).getPropertyValue('font-size');
    	var fontSizeNum = parseFloat(fontPx);
    	var widthPx = window.getComputedStyle(el, null).getPropertyValue('width');
    	var layoutWidthNum = parseFloat(widthPx);
    	var layoutEmNum = layoutWidthNum / fontSizeNum;
    	var mobileBreakpoint = 35.85;
	    
		if (!Modernizr.touch && layoutEmNum >= mobileBreakpoint && !initialized) {
			// init controller
			var controller = new ScrollMagic.Controller();
 
			// create a scene
			myScene = new ScrollMagic.Scene({
				offset: 200 // start this scene after scrolling for X distance in px
			})
				.setPin("#mainNav")
				.setClassToggle("body", "pinned") // pins the element for the the scene's duration
			.addTo(controller); // assign the scene to the controller
			initialized = true;
		} else {
		    if (myScene && layoutEmNum < mobileBreakpoint) {
			    myScene.removePin(true);
			    initialized = false;
		    }
		}
	}; //myResize
	myResize();
	var myResizeDebounced = debounce(myResize, 250);
	window.addEventListener('resize', myResizeDebounced);
	
	//Mobile Nav
	var mobileNav = $("#mainNav ul").clone();
	mobileNav.attr("id", "mobileNav");
	$("#wrapA").append(mobileNav);
	$("#navToggle").click(function(e) {
		e.preventDefault();
		$(this).toggleClass("active");
		$("#mobileNav").toggleClass("visible");
	});
	
	//Sun loader cloned from main sun in logo
	var sunLoader = $("#mainSun").clone();
	sunLoader.removeAttr("id").attr("id", "sunLoader");
	
	var sunLoaded;//sun loader flag
	
	//Ajax Calls
	$('#mainNav').on("click", "a", function(e) {
    	e.preventDefault();
    	//scroll to top
    	$('html,body').animate({
		    scrollTop: 0
		}, 'medium');
		//append sun only once
		var mainSun = $("#mainSun");
		mainSun.fadeOut();
    	if (!sunLoaded) {
    		$("#wrapB").append(sunLoader).fadeIn();
    	} else {
    		sunLoader.fadeIn();
    	}
		//highlight current nav item
    	$("#mainNav").find(".current").removeClass("current");
    	$(this).closest("li").addClass("current");
    	//change url
        var target = $(this).attr('href');
        var mcUrl = target.replace(".html", "");
        window.location.hash = mcUrl;
        //ajax request
        $.ajax({
            url: target,
            success: function(data) {
               	$("#mainContent, #mainBanner")
                    .fadeOut('slow', function() {
                    	$("#mainBanner").html($(data).find("#mainBanner")).fadeIn('slow');
                        $("#mainContent").html($(data).find("#mainContent").html()).fadeIn('slow', function() {
                        	sunLoader.fadeOut();
                        	mainSun.fadeIn(3000);
                        });
                    });
            },
            error: function() {
            	sunLoader.fadeOut();
            	mainSun.fadeIn(3000);
            }
        });
        sunLoaded = true;//flag for sun loader graphic
        return false;
    });

});//document ready