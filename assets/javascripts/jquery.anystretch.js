/*
 * jQuery Anystretch
 * https://github.com/n0wa11/jquery-anystretch
 *
 * Add a dynamically-resized background image to the body
 * of a page or any other block level element within it
 *
 * Two additional features are in this fork. These following features together
 * can do something responsive background piture that CSS cannot.
 *
 * 1) The 2 pairs of image coordinates and container coordinates are specified.
 * These 2 points will be anchored together at all time.
 *
 * 2) A zoom ratio for the image is also specified.
 *
 * 3) Using CSS sprite, so that the image can be zoomed.
 *
 *
 * Copyright (c) 2012 n0wa11 forked from Dan Millar's Anystretch (v1.1)
 *
 * Copyright (c) 2012 Dan Millar (@danmillar / decode.uk.com)
 * Dual licensed under the MIT and GPL licenses.
 *
 * Copyright (c) 2011 Scott Robbin (srobbin.com)
 *
*/

;(function($) {
    
    $.fn.anystretch = function(src, options, callback) {
        var isBody = this.selector.length ? false : true; // Decide whether anystretch is being called on an element or not

        return this.each(function(i){
            var defaultSettings = {
                img_pos_x: 0.50,            // 50% for horizontal and vertical centering
                img_pos_y: 0.50,
                frm_pos_x: 0.50,
                frm_pos_y: 0.50,
                zoom: -1.0,                 // 100% for original image size
                                            // any negative number means smart zooming, like the previous version.
                speed: 0,                // fadeIn speed for background after image loads (e.g. "fast" or 500)
                elPosition: 'relative'  // position of containing element when not being added to the body
            },
            el = $(this),
            container = isBody ? $('.anystretch') : el.children(".anystretch"),
            settings = container.data("settings") || defaultSettings, // If this has been called once before, use the old settings as the default
            existingSettings = container.data('settings'),
            imgRatio, imgWidth, imgHeight, bgImg, bgWidth, bgHeight, bgOffset, bgCSS;

            // Extend the settings with those the user has provided
            if(options && typeof options == "object") $.extend(settings, options);
            
            // Just in case the user passed in a function without options
            if(options && typeof options == "function") callback = options;
        
            // Initialize
            $(document).ready(_init);
      
            // For chaining
            return this;
        
            function _init() {
                // Prepend image, wrapped in a DIV, with some positioning and zIndex voodoo
                if(src) {
                    var img;
                    
                    if(!isBody) {
                        // If not being added to the body set position to elPosition (default: relative) to keep anystretch contained
                        el.css({position: settings.elPosition, background: "none"});
                    }
                    
                    // If this is the first time that anystretch is being called
                    if(container.length == 0) {
                        container = $("<div />").attr("class", "anystretch")
                                                .css({
                                                    left: 0, 
                                                    top: 0, 
                                                    position: (isBody ? "fixed" : "absolute"), 
                                                    overflow: "hidden", 
                                                    zIndex: (isBody ? -999999 : -999998), 
                                                    margin: 0, 
                                                    padding: 0, 
                                                    height: "100%", 
                                                    width: "100%"
                                                });
                    } else {
                        // Prepare to delete any old images
                        container.find("img").addClass("deleteable");
                    }
    
                    img = $("<img />").css({
                                            //position: "absolute", 
                                            display: "none", 
                                            margin: 0, 
                                            padding: 0, 
                                            border: "none", 
                                            zIndex: -999999})
                                      .bind("load", function(e) {                                          
                                          var self = $(this);
        
                                          //self.css({width: "auto", height: "auto"});
                                          imgWidth = this.width || $(e.target).width();
                                          imgHeight = this.height || $(e.target).height();
                                          imgRatio = imgWidth / imgHeight;
    
                                          _adjustBG(function() {
                                              self.fadeIn(settings.speed, function(){
                                                  // Remove the old images, if necessary.
                                                  container.find('.deleteable').remove();
                                                  // Callback
                                                  if(typeof callback == "function") callback();
                                              });
                                          });
                                          
                                      })
                                      .appendTo(container);
                     
                    // Append the container to the body, if it's not already there
                    if(el.children(".anystretch").length == 0) {
                        if(isBody) {
                            $('body').append(container);
                        } else {
                            el.append(container);
                        }
                    }
                    
                    // Attach the settings
                    container.data("settings", settings);
                        
                    // dummy value
                    img.attr("src", "img_anystretch.jpg");
                    //img.attr("src", src); // Hack for IE img onload event
                    
                    // Adjust the background size when the window is resized or orientation has changed (iOS)
                    $(window).resize(_adjustBG);
                }
            }
                
            function _adjustBG(fn) {
                try {
                    bgCSS = {left: 0, top: 0};
                    bgWidth = _width();
                    bgHeight = bgWidth / imgRatio;
    
                    // Make adjustments based on image ratio
                    // Note: Offset code provided by Peter Baker (http://ptrbkr.com/). Thanks, Peter!

                    // coordinates are based at top left corner
                    //
                    // frmWidth * frm_pos_x = zoom * imgWidth * img_pos_x + xOffset
                    // frmHeight * frm_pos_y = zoom * imgHeight * img_pos_y + yOffset
                    //
                    // The current version uses some kind of smart zooming, to make sure the image is
                    // display as much as possible, without leaving any area uncovered.
                    //
                    // zoom = min( frmHeight / imgHeight, frmWidth / imgWidth )
                    
                    frmWidth = _width();
                    frmHeight = _height();

                    if ( settings.zoom < 0 ) {
                        zoom = Math.min( frmHeight / imgHeight, frmWidth / imgWidth );
                    }
                    else {
                        zoom = settings.zoom;
                    }

                    xOffset = frmWidth * settings.frm_pos_x - zoom * imgWidth * settings.img_pos_x;
                    yOffset = frmHeight * settings.frm_pos_y - zoom * imgHeight * settings.img_pos_y;

                    $.extend(bgCSS, {
                        margin: '0',
                        padding: '0',
                        //float: 'left',
                        top: '-100px',
                        left: '-50px',
                        width: '400px',
                        height: '400px',
                        margin: "0px -100px 0 -100px",
                        background: "url(" + src + ") 0 0"


                        //position: relative,
                        //"-webkit-background-size": "cover",
                        //"-moz-background-size": "cover",
                        //"-o-background-size": "cover",
                        //"background-size": "cover"
                
                        //left:       xOffset + 'px',
                        //top:        yOffset + 'px'
                        //width:      imgWidth * zoom + 'px',
                        //height:     imgHeigh * zoom + 'px'
                    });

                    // if(bgHeight >= _height()) {
                    //     bgOffset = (bgHeight - _height()) /2;
                    //     if(settings.positionY == 'center' || settings.centeredY) { // 
                    //         $.extend(bgCSS, {top: "-" + bgOffset + "px"});
                    //     } else if(settings.positionY == 'bottom') {
                    //         $.extend(bgCSS, {top: "auto", bottom: "0px"});
                    //     }
                    // } else {
                    //     bgHeight = _height();
                    //     bgWidth = bgHeight * imgRatio;
                    //     bgOffset = (bgWidth - _width()) / 2;
                    //     if(settings.positionX == 'center' || settings.centeredX) {
                    //         $.extend(bgCSS, {left: "-" + bgOffset + "px"});
                    //     } else if(settings.positionX == 'right') {
                    //         $.extend(bgCSS, {left: "auto", right: "0px"});
                    //     }
                    // }
    
                    container.children("img:not(.deleteable)").width( bgWidth ).height( bgHeight )
                                                       .filter("img").css(bgCSS);
                } catch(err) {
                    // IE7 seems to trigger _adjustBG before the image is loaded.
                    // This try/catch block is a hack to let it fail gracefully.
                }
          
                // Executed the passed in function, if necessary
                if (typeof fn == "function") fn();
            }
            
            function _width() {
                return isBody ? el.width() : el.innerWidth();
            }
            
            function _height() {
                return isBody ? el.height() : el.innerHeight();
            }
            
        });
    };
    
    $.anystretch = function(src, options, callback) {
        var el = ("onorientationchange" in window) ? $(document) : $(window); // hack to acccount for iOS position:fixed shortcomings
        
        el.anystretch(src, options, callback);
    };
  
})(jQuery);
