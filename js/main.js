require.config({
	catchError: true,
	baseUrl: "js/src",
	paths: {
		glmatrix: "../lib/gl-matrix-min",
		domReady: "../lib/require/domReady",
		text: "../lib/require/text",
		WebGLDebugUtils: "../lib/webgl-debug"
	}
});

window.requestAnimFrame = (function(){
  return window.requestAnimationFrame	   ||
		 window.webkitRequestAnimationFrame ||
		 window.mozRequestAnimationFrame	||
		 function(callback) { window.setTimeout(callback, 1000 / 60); };
})();

define(["game"], function(game) {
});

