attribute vec3 aPosition;
attribute vec3 aOffset;
attribute vec2 aTexture;

uniform vec3 uCamPos;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

varying vec4 vWorldVertex;
varying vec3 vWorldNormal;
varying vec4 vPosition;
varying vec2 vTexture;

const vec3 camUp = vec3(0.0, 0.0, 1.0);

// Thanks to http://www.gamedev.net/topic/385785-billboard-shader/#entry3550648
void main(void) {
	vec3 look = normalize(uCamPos - aPosition);
	vec3 right = normalize(cross(camUp, look));
	vec3 up = normalize(cross(look, right));

	vec3 vR = aOffset.x*right;
	vec3 vU = aOffset.z*up;
	vec4 d = vec4(vR+vU-look*0.1, 0.0);
	vPosition = vWorldVertex = uMMatrix * (vec4(aPosition, 1.0) + d);

	vWorldNormal = look;
	vTexture = aTexture;

	gl_Position = uPMatrix * uVMatrix * vWorldVertex;
}

