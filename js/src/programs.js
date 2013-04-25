define([
	"gl",
	"text!shaders/world.vs", "text!shaders/world.fs", 
	"text!shaders/depth.vs", "text!shaders/depth.fs"
	], 
	function(gl, worldV, worldF, depthV, depthF){
		/** Returns compiled shader */
		this.getShader = function(type, text) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, text);
			gl.compileShader(shader);

			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw (type == gl.VERTEX_SHADER ? "Vertex" : "Fragment")
					+ " failed to compile:\n\n" 
					+ gl.getShaderInfoLog(shader);
			}

			return shader;
		}

		/** Assigns shaders to program and returns the program */
		this.initShader = function(vertexShaderText, fragmentShaderText) {
			var shaderProgram = gl.createProgram();
			gl.attachShader(shaderProgram, this.getShader(gl.VERTEX_SHADER, vertexShaderText));
			gl.attachShader(shaderProgram, this.getShader(gl.FRAGMENT_SHADER, fragmentShaderText));
			gl.linkProgram(shaderProgram);

			if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) 
				throw new Error("Could not initialize shaders");

			return shaderProgram;
		}

		return {
			worldShader: this.initShader(worldV,worldF),
			depthShader: this.initShader(depthV,depthF)
		};

	}
);


