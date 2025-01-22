//distance from Vec Shadder
uniform vec3 orbPosition;
uniform vec3 armadilloPos;
void main() {
	//feat extn
	//distance to armadillo
	float distanceToArmadillo = distance(orbPosition, armadilloPos);
	//colour vector
	vec3 colour;
	//setting colour each coulour of the rainbow VIBGYR going from closest to farthest(shortest wavelength - largest)
	if (distanceToArmadillo <= 3.0) {
		colour = vec3(0.56, 0.0, 1.0); //V
	} else if (distanceToArmadillo <= 5.0) {
		colour = vec3(0.29, 0.0, 0.51);//I
	} else if (distanceToArmadillo <= 7.0) {
		colour = vec3(0.0, 0.0, 1.0);//B
	} else if (distanceToArmadillo <= 9.0) {
		colour = vec3(0.0, 1.0, 0.0);//G
	} else if (distanceToArmadillo <= 11.0) {
		colour = vec3(1.0, 1.0, 0.0);//Y
	}else {
		colour = vec3(1.0, 0.0, 0.0);//R
	}
 	// TODO: Set final rendered color here
	
	//set to yellow
  	gl_FragColor = vec4(colour, 1.0);

}
