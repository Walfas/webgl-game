precision mediump float;

const float Near = 1.0;
const float Far = 30.0;
const float LinearDepthConstant = 1.0 / (Far - Near);

struct PointLight
{
	float enabled;
	vec3 color;
	vec3 position;
};

varying vec4 vWorldVertex;
varying vec3 vWorldNormal;
varying vec3 vViewVec;
varying vec4 vPosition;
varying vec2 vTexture;

uniform PointLight uLight[1];
uniform sampler2D uDepthMap;

uniform sampler2D uSampler; // texture coords
uniform vec3 uAmbientColor;

float unpack(vec4 color)
{
	const vec4 bitShifts = vec4(1.0, 1.0/255.0, 1.0/(255.0*255.0), 1.0/(255.0*255.0*255.0));
	return dot(color, bitShifts);
}

void main(void) {
	vec3 normal = normalize(vWorldNormal);
	vec4 texColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));
	if (texColor.a < 0.1)
		discard;

	vec3 color = uAmbientColor;

	for (int i=0; i<1; i++) {
		if (uLight[i].enabled < 0.5)
			continue;
		vec3 lightVec = normalize(uLight[i].position - vWorldVertex.xyz);
		float l = dot(normal, lightVec);
		if (l > 0.0)
			color += l*uLight[i].color;
	}

	vec3 depth = vPosition.xyz / vPosition.w;
	depth.z = length(vWorldVertex.xyz - uLight[0].position) * LinearDepthConstant;
	float shadow = 1.0;

	depth.z *= 0.96; // Offset depth 
	if (depth.z > unpack(texture2D(uDepthMap, depth.xy)))
		shadow *= 0.5;

	gl_FragColor = clamp(vec4(texColor.rgb*color*shadow, texColor.a), 0.0, 1.0);

/*
	vec4 fragmentColor = texture2D(uSampler, vec2(vTexture.s, vTexture.t));
	if (fragmentColor.a < 0.1) // Transparent textures
		discard;

	vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
	float directionalLightWeighting = max(dot(normalize(vTransformedNormal), lightDirection), 0.0);
	vec3 lightWeighting = uAmbientColor + uPointLightingColor * directionalLightWeighting;

	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);	
*/
}

