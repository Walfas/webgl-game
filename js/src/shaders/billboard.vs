attribute vec3 aPosition;
attribute vec3 aOffset;
attribute vec2 aTexture;

uniform vec3 uCamPos;
uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;
uniform float uCounter;

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

	vec3 offset = aOffset;
	vec3 mult = vec3(0.05, 0.0, 0.13);
	if (offset.x < 0.0)
		mult.x *= -1.0;
	if (offset.z > 0.0)
		mult.z *= -1.0;
	else
		mult.z = 0.0;

	offset.x += sin(uCounter/3.0)*mult.x;
	offset.z += cos(uCounter/3.0)*mult.z;

	vec3 vR = offset.x*right;
	vec3 vU = offset.z*up;
	vec4 d = vec4(vR+vU-look*0.1, 0.0);
	vPosition = vWorldVertex = uMMatrix * (vec4(aPosition, 1.0) + d);

	vWorldNormal = look;
	vTexture = aTexture;

	gl_Position = uPMatrix * uVMatrix * vWorldVertex;
}

