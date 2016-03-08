/**
 * <details> and <summary> crossbrowser support
 *
 * This polyfill makes <details>/<summary> ready for use
 * in all modern browsers.
 * http://dev.w3.org/html5/spec/Overview.html#the-details-element
 * 
 * @author Shawn Duncan
 * @version 0.1
 * @license GNU GENERAL PUBLIC LICENSE, Version 2, June 1991
 *
 * Date $LastChangedDate:  Tuesday, March 8, 2016: 15:43 UTC $
 *
 */

;(function() {
	"use strict";
	var summaryNode = 'summary';
	var detailsNode = 'details';
	
	//Power up old IEs. When these are created, IE understands that
	//there are suche elements.	
	document.createElement (detailsNode);  
	document.createElement (summaryNode);
	
	function init() {
		
		// Use Modernizr
		var isDetailsSupported = Modernizr.details;
		
		if (!isDetailsSupported) {
			var rightArrow = String.fromCharCode (9658);
			var downArrow = String.fromCharCode (9660);

			var styles = [
				'details > * {position: absolute;top: -4000px;left: -4000px;}',
				'details > summary, details[open] > * {position: static;}',
				'details, details > summary {display: block;}',
				'details > summary:before {content: "' + rightArrow + '";padding-right: 5px;font-size: 11px;}',
				'details[open] > summary:before {content:"' + downArrow + '"}'
			];
			
			if (/*IE7*/ false) {
				//TODO - add a background-image for right and down arrows
				styles.push ('details > summary { ... }');						
			}
			styles = styles.join ('\n');
			
			//Build a stylesheet for the css based handling.
			var head = document.getElementsByTagName ('HEAD')[0];
			var css = document.createElement('style');
			css.type = 'text/css';
			if (css.styleSheet) {
				css.styleSheet.cssText = styles;
			} else {
				css.appendChild(document.createTextNode(styles));					
			}
			
			//Insert the stylesheet on the top.
			//The idea is to keep it before other stylesheets
			//so they can be applied after this one.
			var c = head.childNodes && head.childNodes[0]; 
			if (c) {
				head.insertBefore (css, c);
			} else {
				head.appendChild (css);
			}
			
			var body = document.getElementsByTagName ('BODY')[0];
			
			if (!window.addEventListener) {				
				window.addEventListener = function (eventType, callback, dummy) {
					//This is intentional. The click event is firing on document for IE<9.
					document.attachEvent ('on' + eventType, function (event) {
						//Compatibility code for the event object.
						var e = event || window.event;
						if (!e.target) {
							e.target = e.srcElement;
						}
						if (typeof e.preventDefault !== 'function') {
							e.preventDefault = function() { this.returnValue = false; };
						}
						if (typeof e.stopPropagation !== 'function') {
							e.stopPropagation = function() { this.cancelBubble = true; };
						}								
						callback (e); 
					});
				};
					
			}
			
			//Body class name gets altered in order to trigger 
			//document rerender, because set/remove attribute
			//function don't do it.
			var dummyClassName = 'trigger-refresh ';
			var dummyClassNameLength = dummyClassName.length;
			body.className = body.className || '';
			
			//Now what we need is a click listener that toggles the open
			//attribute of the details element only when the click
			//is on its summary child element.
			window.addEventListener ('click', function (event) {
				var target = event.target;
				var targetNode, parentNode;
				
				//The loop is required because there can be additional 
				//child elements within the summary element.
				while (target) {
					targetNode = target.nodeName.toLowerCase();
					if (targetNode === summaryNode) {
						parentNode = target.parentNode;
						//getAttributeNode is used instead of hasAttribute because 
						//older IEs don't support it.						
						if (parentNode.getAttributeNode ('open')) {
							parentNode.removeAttribute ('open');
						} else {
							parentNode.setAttribute ('open', 'open');
						}
						//Force refresh for IE.
						body.className = dummyClassName + body.className;
						body.className = body.className.substr (dummyClassNameLength);
						break;
					}
					if (targetNode === detailsNode) {
						break;
					}
					target = target.parentNode;
				}
			}, false);
		}
	}
	
	//Wait for the BODY element to become available
	function loader() {
		if (document.getElementsByTagName ('BODY').length > 0) {
			init();
		} else {
			setTimeout (loader, 50);
		}
	}
	loader();
})();			
