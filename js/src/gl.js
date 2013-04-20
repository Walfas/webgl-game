define(["canvas", "WebGLDebugUtils"], function(canvas) {
	var gl;
	try {
		gl = WebGLDebugUtils.makeDebugContext(canvas.getContext("experimental-webgl"));
	} catch (e) {
		alert(e);
	}
	if (!gl) 
		alert("Could not initialize WebGL");

	return gl;
});

