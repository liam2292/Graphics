// The uniform variable is set up in the javascript code and the same for all vertices
uniform vec3 orbPosition;
uniform float orbRadius;

// This is a "varying" variable and interpolated between vertices and across fragments.
// The shared variable is initialized in the vertex shader and passed to the fragment shader.
out float intensity;

//world position to fragment shadder
out vec3 fragWorldPos;

void main() {
    //world space position of single ertex
    fragWorldPos =  (modelMatrix * vec4(position, 1.0)).xyz;
    float distanceToSphere = distance(fragWorldPos, orbPosition);
    
    // Extract the upper-left 3x3 portion of the model matrix to find the directional transformations
    mat3 upperLeftModelMatrix = mat3(modelMatrix);

    // Compute the normal matrix as the inverse transpose = (modelMatrix)^(-1T)
    mat3 normalMatrix = transpose(inverse(upperLeftModelMatrix));
  //the two lines above are chat I need to undertand and alter
  
    //light drection: light source - modle position in world
    vec3 lightDirect = normalize(orbPosition - fragWorldPos);
    //normal matrix in world
    vec3 normMat = normalize(normalMatrix * normal);
    intensity = dot(normMat,lightDirect); // TODO: REPLACE ME
    intensity = max(intensity, 0.0);
    // TODO: Make changes here for part b, c, d
  	// HINT: INTENSITY IS CALCULATED BY TAKING THE DOT PRODUCT OF THE NORMAL AND LIGHT DIRECTION VECTORS\

    // Multiply each vertex by the model matrix to get the world position of each vertex, 
    // then the view matrix to get the position in the camera coordinate system, 
    // and finally the projection matrix to get final vertex position
    //Edit the gl_position so that the vertices in range move no the entirety ie position - orbposition moves the full obj
    if(distanceToSphere < orbRadius) {
        //normalize the cirection from the orbs center to the vertex making it a unit vector 
        vec3 direction = normalize(fragWorldPos - orbPosition);
        //is the new position of the deformed vertices altered postion scaled by the orb radious 
        vec3 deformedPosition = orbPosition + direction * orbRadius;

        //updated position including the deformation
        gl_Position = projectionMatrix * viewMatrix * vec4(deformedPosition, 1.0);
    } else {
      gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    }
    
}
