attribute vec3 aPosition;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec4 vColor;

void main(void) {
	gl_Position = uMVMatrix * vec4(aPosition, 1.0);
	gl_Position += vec4(0,0,-5,1);
	gl_Position = uPMatrix * gl_Position;
	vColor = vec4(1,1,1,2) - vec4(aPosition,1.0); //vec4(aPosition, 1.0);
}

