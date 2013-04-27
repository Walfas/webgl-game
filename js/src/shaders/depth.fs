precision mediump float;

const float Near = 1.0;
const float Far = 30.0;
const float LinearDepthConstant = 1.0 / (Far - Near);

varying vec4 vPosition;

// Via http://devmaster.net/posts/3002/shader-effects-shadow-mapping
vec4 pack(float depth) {
	const vec4 bias = vec4(1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0);

	float r = depth;
	float g = fract(r*255.0);
	float b = fract(g*255.0);
	float a = fract(b*255.0);
	vec4 color = vec4(r, g, b, a);

	return color - (color.yzww * bias);
}

void main(void) {
	float linearDepth = length(vPosition) * LinearDepthConstant;
	/*gl_FragColor = pack(linearDepth);*/
	gl_FragColor = vec4(1.0,0.0,1.0,1.0);
}

