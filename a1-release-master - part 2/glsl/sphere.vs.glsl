// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;
uniform vec3 armadilloPos;

out float distanceToArma;
void main() {
    //feat extn
    // distance from orb to armadillo
    float distanceToArma = distance(orbPosition,armadilloPos);
    
    //scaling factor
    float scalingFactor = distanceToArma / 10.0;
    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position.

    // TODO: Make changes here to make the orb move as the light source
    // matches speher position with the lights position(orbPosition)
    // added scaling factor
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position*scalingFactor + orbPosition, 1.0);

}
