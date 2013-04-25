attribute vec3 aPosition;

uniform mat4 uVMatrix;
uniform mat4 uMMatrix;
uniform mat4 uPMatrix;

varying vec4 vPosition;

void main(void) {
	vPosition = uVMatrix * uMMatrix * vec4(aPosition, 1.0);
	gl_Position = uPMatrix * vPosition;
}

