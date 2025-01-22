/*
 * UBC CPSC 314, Vjan2024
 * Assignment 1 Template
 */

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniform
const orbPosition = { type: 'v3', value: new THREE.Vector3(0.0, 7.0, 0.0) };
// TODO: Create uniform variable for the radius of the orb and pass it into the shaders,
const orbRadius = { type: 'f', value: 2.0 };
// you will need them in the latter part of the assignment

// Materials: specifying uniforms and shaders
const armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    orbPosition: orbPosition,
    orbRadius: orbRadius
  }
});
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    orbPosition: orbPosition
  }
});

// Load shaders.
const shaderFiles = [
  'glsl/armadillo.vs.glsl',
  'glsl/armadillo.fs.glsl',
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl'
];

new THREE.SourceLoader().load(shaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl/armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl/armadillo.fs.glsl'];

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];
})

// Load and place the Armadillo geometry
// Look at the definition of loadOBJ to familiarize yourself with how each parameter
// affects the loaded object.
loadAndPlaceOBJ('obj/armadillo.obj', armadilloMaterial, function (armadillo) {
  armadillo.position.set(0.0, 5.3, -8.0);
  armadillo.rotation.y = Math.PI;
  armadillo.scale.set(0.1, 0.1, 0.1);
  armadillo.parent = worldFrame;
  scene.add(armadillo);
});

// TODO: Add the hat to the scene on top of the Armadillo similar to how the Armadillo
// is added to the scene
loadAndPlaceOBJ('obj/bucket_hat.obj', armadilloMaterial, function (bucket_hat) {
  bucket_hat.position.set(0.0, 13, -6.0);
  bucket_hat.rotation.y = Math.PI;
  bucket_hat.scale.set(5, 5, 5);
  bucket_hat.parent = worldFrame;
  scene.add(bucket_hat);
});

// Create the sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
// TODO: Make the radius of the orb a variable
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(0.0, 0.0, 0.0);
sphere.parent = worldFrame;
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 1, 100);
scene.add(sphereLight);

// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    orbPosition.value.z -= 0.3;
  else if (keyboard.pressed("S"))
    orbPosition.value.z += 0.3;

  if (keyboard.pressed("A"))
    orbPosition.value.x -= 0.3;
  else if (keyboard.pressed("D"))
    orbPosition.value.x += 0.3;

  if (keyboard.pressed("E"))
    orbPosition.value.y -= 0.3;
  else if (keyboard.pressed("Q"))
    orbPosition.value.y += 0.3;

  // The following tells three.js that some uniforms might have changed
  armadilloMaterial.needsUpdate = true;
  sphereMaterial.needsUpdate = true;

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(orbPosition.value.x, orbPosition.value.y, orbPosition.value.z);
}

// Setup update callback
function update() {
  checkKeyboard();

  // Requests the next update call, this creates a loop
  requestAnimationFrame(update);
  renderer.render(scene, camera);
}

// Start the animation loop.
update();
