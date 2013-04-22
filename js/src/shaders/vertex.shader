attribute vec3 aPosition;
attribute vec2 aTexture;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTexture;

void main(void) {
	gl_Position = uMVMatrix * vec4(aPosition, 1.0);
	gl_Position += vec4(0,0,-5,1);
	gl_Position = uPMatrix * gl_Position;
	vTexture = aTexture;
}

