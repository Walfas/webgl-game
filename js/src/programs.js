define([
	"gl",
	"text!shaders/world.vs", "text!shaders/world.fs", 
	"text!shaders/depth.vs", "text!shaders/depth.fs"
	], 
	function(gl, worldV, worldF, depthV, depthF) {
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
		
		this.newProgram = function(vs, fs, att, uni) {
			var glProgram = this.initShader(vs,fs);
			var p = {
				program: glProgram,
				a: {},
				u: {}
			};
			for (var i=0; i<att.length; i++) {
				p.a[att[i]] = gl.getAttribLocation(glProgram, att[i]);
				gl.enableVertexAttribArray(p.a[att[i]]);
			}
			for (var i=0; i<uni.length; i++) 
				p.u[uni[i]] = gl.getUniformLocation(glProgram, uni[i]);
			return p;
		}

		return {
			world: this.newProgram(
				worldV, worldF, 
				[
					"aPosition", 
					"aTexture", 
					"aNormal"
				],
				[
					"uPMatrix", 
					"uNMatrix", 
					"uMMatrix", 
					"uVMatrix", 
					"uSampler", 
					"uLightVMatrix", 
					"uLightPMatrix", 
					"uAmbientColor", 
					"uDepthMap", 
					"uLight"
				]
			),
			depth: this.newProgram(
				depthV, depthF,
				[
					"aPosition"
				],
				[
					"uPMatrix", 
					"uNMatrix", 
					"uMMatrix", 
				]
			)
		};

	}
);


