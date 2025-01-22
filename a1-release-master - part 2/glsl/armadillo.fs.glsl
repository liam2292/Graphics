
// The value of the "varying" variable is interpolated between values computed in the vertex shader
// The varying variable we passed from the vertex shader is identified by the 'in' classifier
in float intensity;
in vec3 fragWorldPos;

uniform float orbRadius;
uniform vec3 orbPosition;

void main() {
 	// TODO: Set final rendered colour to intensity (a grey level)
	float distanceToSphere = distance(fragWorldPos, orbPosition);
	
	// when distance to the sphere is less than the radius cyan will illuminate the models 
	//immediate vascinity
	if(distanceToSphere < orbRadius) {
		gl_FragColor = vec4(intensity*vec3(0.0,1.0,1.0), 1.0); 
	} else {
		gl_FragColor = vec4(intensity*vec3(1.0,1.0,1.0), 1.0); 
	}
	
}
