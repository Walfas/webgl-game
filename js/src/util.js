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

		/** Make box function (via J3DI library) */
		/*
		 * Copyright (C) 2009 Apple Inc. All Rights Reserved.
		 *
		 * Redistribution and use in source and binary forms, with or without
		 * modification, are permitted provided that the following conditions
		 * are met:
		 * 1. Redistributions of source code must retain the above copyright
		 *    notice, this list of conditions and the following disclaimer.
		 * 2. Redistributions in binary form must reproduce the above copyright
		 *    notice, this list of conditions and the following disclaimer in the
		 *    documentation and/or other materials provided with the distribution.
		 *
		 * THIS SOFTWARE IS PROVIDED BY APPLE INC. ``AS IS'' AND ANY
		 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
		 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
		 * PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL APPLE INC. OR
		 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
		 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
		 * PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
		 * PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY
		 * OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
		 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
		 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
		 */
		makeBox: function() {
			//    v6----- v5
			//   /|      /|
			//  v1------v0|
			//  | |     | |
			//  | |v7---|-|v4
			//  |/      |/
			//  v2------v3

			// vertex coords array
			var vertices = new Float32Array(
				[  1, 1, 1,  -1, 1, 1,  -1,-1, 1,   1,-1, 1,	// v0-v1-v2-v3 front
				   1, 1, 1,   1,-1, 1,   1,-1,-1,   1, 1,-1,	// v0-v3-v4-v5 right
				   1, 1, 1,   1, 1,-1,  -1, 1,-1,  -1, 1, 1,	// v0-v5-v6-v1 top
				  -1, 1, 1,  -1, 1,-1,  -1,-1,-1,  -1,-1, 1,	// v1-v6-v7-v2 left
				  -1,-1,-1,   1,-1,-1,   1,-1, 1,  -1,-1, 1,	// v7-v4-v3-v2 bottom
				   1,-1,-1,  -1,-1,-1,  -1, 1,-1,   1, 1,-1 ]   // v4-v7-v6-v5 back
			);

			// normal array
			var normals = new Float32Array(
				[  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,	 // v0-v1-v2-v3 front
				   1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,	 // v0-v3-v4-v5 right
				   0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,	 // v0-v5-v6-v1 top
				  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0,	 // v1-v6-v7-v2 left
				   0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0,	 // v7-v4-v3-v2 bottom
				   0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1 ]	 // v4-v7-v6-v5 back
			   );


			// texCoord array
			var texCoords = new Float32Array(
				[  1, 1,   0, 1,   0, 0,   1, 0,	// v0-v1-v2-v3 front
				   0, 1,   0, 0,   1, 0,   1, 1,	// v0-v3-v4-v5 right
				   1, 0,   1, 1,   0, 1,   0, 0,	// v0-v5-v6-v1 top
				   1, 1,   0, 1,   0, 0,   1, 0,	// v1-v6-v7-v2 left
				   0, 0,   1, 0,   1, 1,   0, 1,	// v7-v4-v3-v2 bottom
				   0, 0,   1, 0,   1, 1,   0, 1 ]   // v4-v7-v6-v5 back
			   );

			// index array
			var indices = new Uint8Array(
				[  0, 1, 2,   0, 2, 3,	// front
				   4, 5, 6,   4, 6, 7,	// right
				   8, 9,10,   8,10,11,	// top
				  12,13,14,  12,14,15,	// left
				  16,17,18,  16,18,19,	// bottom
				  20,21,22,  20,22,23 ] // back
			  );

			var retval = { };

			retval.normalObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, retval.normalObject);
			gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);

			retval.texCoordObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, retval.texCoordObject);
			gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

			retval.vertexObject = gl.createBuffer();
			gl.bindBuffer(gl.ARRAY_BUFFER, retval.vertexObject);
			gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

			gl.bindBuffer(gl.ARRAY_BUFFER, null);

			retval.indexObject = gl.createBuffer();
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, retval.indexObject);
			gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
			gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

			retval.numIndices = indices.length;

			return retval;
		}
	};
});

