define(["gl"], function(gl){
	window.requestAnimFrame = (function(){
	  return window.requestAnimationFrame	   ||
			 window.webkitRequestAnimationFrame ||
			 window.mozRequestAnimationFrame	||
			 function(callback) { window.setTimeout(callback, 1000 / 60); };
	})();

	return {
		/** Returns compiled shader */
		getShader: function(type, text) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, text);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw (type == gl.VERTEX_SHADER ? "Vertex" : "Fragment")
					+ " failed to compile:\n\n" 
					+ gl.getShaderInfoLog(shader);
			}

			return shader;
		},

		/** Assigns shaders to program and returns the program */
		initShader: function(vertexShaderText, fragmentShaderText) {
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, this.getShader(gl.VERTEX_SHADER, vertexShaderText));
			gl.attachShader(shaderProgram, this.getShader(gl.FRAGMENT_SHADER, fragmentShaderText));
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
				throw new Error("Could not initialize shaders");

			return shaderProgram;
		},
	};
});

