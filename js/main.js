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

define(["game"], function(game) {
});

