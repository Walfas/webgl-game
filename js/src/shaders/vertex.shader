attribute vec3 aPosition;
attribute vec3 aNormal;
attribute vec2 aTexture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat3 uNMatrix;

varying vec2 vTexture;
varying vec3 vTransformedNormal;
varying vec4 vPosition;

void main(void) {
	vPosition = uMVMatrix * vec4(aPosition + vec3(-1.5,-1.5,-1.5), 1.0);
	vPosition += vec4(0,0,-5,0);
	gl_Position = uPMatrix * vPosition;
	vTexture = aTexture;
	vTransformedNormal = uNMatrix * aNormal;
}

