logifill-details
================

An adaptation of Marian Kostadinov's Polyfill for html5 details and summary elements.
This is an unobtrusive limited dependency implementation
of HTML5 details/summary implementation. It uses Modernizer for feature detection.
See browser support for <details> at http://caniuse.com/#feat=details as of March 2016 the
tag is supported in Chrome, Safari, iOS Safari, Opera and Android browser.

This polyfill adds full support for Firefox and IE8+.

Unlike the other solutions, this one has two specific features:
1. It does not rely on jQuery or but does make use of Modernizr. Use Marian's original if you want no dependencies at all.
2. It works for dynamic content because it does not attach
any event listeners to any summary or details elements.
There is a single listener that handles the click event
and reacts ONLY when the click happens on a summary element.

Usage
-----
Include this anywhere in your HEAD section: 
<script type="text/javascript" src="logifill-details.js"></script>
It does not add anything to the JavaScript global scope. 

Gotchas
-------
If details is used without a summary, there is no way to toggle the 
section, even though webkit browsers show a default summary in that case.
Direct text children of the summary elements are not invisible.
Wrapping these elements in a span or other element is a good idea.