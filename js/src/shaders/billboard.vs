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

const vec3 facing = vec3(0.0, -1.0, 0.0);
const vec3 xAxis = vec3(1.0, 0.0, 0.0);

mat4 rotationMatrix(vec3 a, float angle) {
	//a = normalize(a);
	float s = sin(angle);
	float c = cos(angle);
	float oc = 1.0 - c;
	
	return mat4(
		oc * a.x * a.x + c,        oc * a.x * a.y - a.z * s,  oc * a.z * a.x + a.y * s,  0.0,
		oc * a.x * a.y + a.z * s,  oc * a.y * a.y + c,        oc * a.y * a.z - a.x * s,  0.0,
		oc * a.z * a.x - a.y * s,  oc * a.y * a.z + a.x * s,  oc * a.z * a.z + c,        0.0,
		0.0,                       0.0,                       0.0,                       1.0
	);
}

const vec3 camUp = vec3(0.0, 0.0, 1.0);
void main(void) {
/*
	vec3 at = uCamPos - aPosition; // Object to camera
	vec3 atProj = vec3(at.xy, 0.0); // Project onto z-axis
	at = normalize(at);
	atProj = normalize(atProj);

	vec3 up = cross(facing, atProj);
	float theta = -acos(dot(facing, atProj));
	mat4 r = rotationMatrix(up, theta);
	float phi = acos(dot(atProj, at));
	if (at.z >= 0.0)
		phi *= -1.0;
	r = rotationMatrix(xAxis, phi) * r;

	vPosition = vWorldVertex = uMMatrix * (vec4(aPosition, 1.0) + r * vec4(aOffset, 1.0));
	//vPosition = vWorldVertex = uMMatrix * (r * vec4(aOffset, 1.0));
	vWorldNormal = normalize(r * vec4(facing, 1.0)).xyz;
	vTexture = aTexture;

	gl_Position = uPMatrix * uVMatrix * vWorldVertex;
	*/

	vec3 look = normalize(uCamPos - aPosition);
	vec3 right = normalize(cross(camUp, look));
	vec3 up = normalize(cross(look, right));

	vec3 vR = aOffset.xxx*right;
	vec3 vU = aOffset.zzz*up;
	vec4 d = vec4(vR+vU, 0.0);
	vPosition = vWorldVertex = uMMatrix * (vec4(aPosition, 1.0) + d);

	vWorldNormal = vec3(0.0, 1.0, 0.0);
	vTexture = aTexture;

	gl_Position = uPMatrix * uVMatrix * vWorldVertex;
}

