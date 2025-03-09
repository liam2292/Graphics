/*
 * UBC CPSC 314 2024W2
 * Assignment 2 Template
 */

import { setup, loadAndPlaceGLB } from './js/setup.js';
import * as THREE from './js/three.module.js';
import { SourceLoader } from './js/SourceLoader.js';
import { THREEx } from './js/KeyboardState.js';
import { CCDIKHelper, CCDIKSolver } from './js/CCDIKSolver.js';

// Setup and return the scene and related objects.
// You should look into js/setup.js to see what exactly is done here.
const {
  renderer,
  scene,
  camera,
  worldFrame,
} = setup();

// Used THREE.Clock for animation
var clock = new THREE.Clock();

/////////////////////////////////
//   YOUR WORK STARTS BELOW    //
/////////////////////////////////

// Initialize uniforms

// As in A1 we position the sphere in the world solely using this uniform
// So the initial y-offset being 1.0 here is intended.
const sphereOffset = { type: 'v3', value: new THREE.Vector3(0.0, 1.0, 0.0) };

// Distance threshold beyond which the armadillo should shoot lasers at the sphere (needed for Q1c).
const LaserDistance = 10.0;


// Materials: specifying uniforms and shaders
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    sphereOffset: sphereOffset,
  }
});
const eyeMaterial = new THREE.ShaderMaterial();
const laserMaterial = new THREE.ShaderMaterial();

// TODO: make necessary changes to implement the laser eyes
// Load shaders.
const shaderFiles = [
  'glsl/sphere.vs.glsl',
  'glsl/sphere.fs.glsl',
  'glsl/eye.vs.glsl',
  'glsl/eye.fs.glsl',
  'glsl/laser.vs.glsl',
  'glsl/laser.fs.glsl',
];

new SourceLoader().load(shaderFiles, function (shaders) {

  sphereMaterial.vertexShader = shaders['glsl/sphere.vs.glsl'];
  sphereMaterial.fragmentShader = shaders['glsl/sphere.fs.glsl'];

  eyeMaterial.vertexShader = shaders['glsl/eye.vs.glsl'];
  eyeMaterial.fragmentShader = shaders['glsl/eye.fs.glsl'];

  laserMaterial.vertexShader = shaders['glsl/laser.vs.glsl'];
  laserMaterial.fragmentShader = shaders['glsl/laser.fs.glsl'];
});


// TODO: Load and place the armadillo geometry in GLB format
// Look at the definition of loadOBJ to familiarize yourself with how each parameter
// affects the loaded object.
let  leftShoulder, leftUpperArm, leftForearm, leftHand, leftHandIK, ikSolver, skinnedMesh;
loadAndPlaceGLB("glb/armadillo.glb", scene, function (arma) {
  const armaModel = arma.scene;
  leftEyeSocket.position.set(-10, 70, -28);
  rightEyeSocket.position.set(10, 70, -28);
  
  armaModel.add(leftEyeSocket);
  armaModel.add(rightEyeSocket);

  leftShoulder = arma.leftShoulder;
  leftUpperArm = arma.leftUpperArm;
  leftForearm = arma.leftForearm;
  leftHand = arma.leftHand;
  leftHandIK = arma.leftHandIK;
  skinnedMesh = arma.skinnedMesh;

  // defines ik constraints ie the bones needed to move the left arm
  const iks = [
    {
      target:13,
      effector:6,
      links:[{index: 5}, {index: 4}, {index: 3}]
    }
  ]

  //IK solver and helper setup to visuallize
  ikSolver = new CCDIKSolver(skinnedMesh,iks);
  //const ikHelper = new CCDIKHelper(skinnedMesh,iks);
  //scene.add(ikHelper);
});

// Create the main sphere geometry
// https://threejs.org/docs/#api/en/geometries/SphereGeometry
const sphereGeometry = new THREE.SphereGeometry(1.0, 32.0, 32.0);
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);

const sphereLight = new THREE.PointLight(0xffffff, 50.0, 100);
scene.add(sphereLight);

// Create an eye ball (left eye as example)
// HINT: Create two eye ball meshes from the same geometry.
const eyeGeometry = new THREE.SphereGeometry(1.0, 32, 32);
const eyeScale = 5;

const leftEyeSocket = new THREE.Object3D();

const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
leftEye.scale.copy(new THREE.Vector3(eyeScale, eyeScale, eyeScale));
leftEyeSocket.add(leftEye);

// TODO: Create the right eye
//right eye based on code above share the same eyeGeometry
const rightEyeSocket = new THREE.Object3D();

const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
rightEye.scale.copy(new THREE.Vector3(eyeScale, eyeScale, eyeScale));
rightEyeSocket.add(rightEye);

//laser geometry
const laserGeometry = new THREE.CylinderGeometry(1, 1, 10, 16);
laserGeometry.rotateX(Math.PI / 2);
laserGeometry.translate(0, 0, 5);
const leftLaser = new THREE.Mesh(laserGeometry, laserMaterial);
const rightLaser = new THREE.Mesh(laserGeometry, laserMaterial);

//add right and left laser to the right and left eye
rightEyeSocket.add(rightLaser);
leftEyeSocket.add(leftLaser);


// Listen to keyboard events.
const keyboard = new THREEx.KeyboardState();
function checkKeyboard() {
  if (keyboard.pressed("W"))
    sphereOffset.value.z -= 0.1;
  else if (keyboard.pressed("S"))
    sphereOffset.value.z += 0.1;

  if (keyboard.pressed("A"))
    sphereOffset.value.x -= 0.1;
  else if (keyboard.pressed("D"))
    sphereOffset.value.x += 0.1;

  if (keyboard.pressed("E"))
    sphereOffset.value.y -= 0.1;
  else if (keyboard.pressed("Q"))
    sphereOffset.value.y += 0.1;

  // The following tells three.js that some uniforms might have changed.
  sphereMaterial.needsUpdate = true;
  eyeMaterial.needsUpdate = true;
  laserMaterial.needsUpdate = true;

  // Move the sphere light in the scene. This allows the floor to reflect the light as it moves.
  sphereLight.position.set(sphereOffset.value.x, sphereOffset.value.y, sphereOffset.value.z);
}


// Setup update callback
function update() {

  // TODO: Make any changes to implement gazing, grabing, or anything you think is necessary for IK
  // CCDIKSolver: https://threejs.org/docs/#examples/en/animations/CCDIKSolver
  checkKeyboard();
  // worldPosition of the sphere
  const spherePos = new THREE.Vector3(sphereOffset.value.x, sphereOffset.value.y, sphereOffset.value.z);
  
  //eyes track the sphere
  rightEye.lookAt(spherePos);
  leftEye.lookAt(spherePos);

  // get world position of both of the eyes
  const leftEyePos = leftEyeSocket.getWorldPosition(new THREE.Vector3());
  const rightEyePos = rightEyeSocket.getWorldPosition(new THREE.Vector3());
  
  //calculate distance from each eye to sphere
  const leftDistance = leftEyePos.distanceTo(spherePos);
  const rightDistance = rightEyePos.distanceTo(spherePos);

  //set scale of the laser making the length equivalent to the distance from each eye
  leftLaser.scale.set(1, 1, leftDistance);
  rightLaser.scale.set(1, 1, rightDistance);
  //set visibility true if the sphere is within laserdistance of either eye
  const minDistance = Math.min(spherePos.distanceTo(leftEyePos), spherePos.distanceTo(rightEyePos));
  leftLaser.visible = minDistance < LaserDistance;
  rightLaser.visible = minDistance < LaserDistance;
  //Laser tracks the sphere just as the eyes
  leftLaser.lookAt(spherePos);
  rightLaser.lookAt(spherePos);

  //left arm "catching" the sphere mechanic
  if(leftShoulder && leftHandIK) {
    //updates skinned mesh for armadillo has latest transformation
    skinnedMesh.updateMatrixWorld(true);

    //vector for the arm from sholder to hand (armBase, armEnd)
    const armBase = new THREE.Vector3();
    leftShoulder.getWorldPosition(armBase);
    const armEnd = new THREE.Vector3();
    leftHandIK.getWorldPosition(armEnd);

    //calc dist to sphere from the shoulder
    const distToBall = armBase.distanceTo(spherePos);
    const maxDist = 10;

    // get arm direction by sub armend-armbase and ball direction from the shoulder to sphere spherePos-armBase
    const armDirect = new THREE.Vector3().subVectors(armEnd,armBase).normalize();
    const ballDirect = new THREE.Vector3().subVectors(spherePos,armBase).normalize();

    //calc the angle from the ball to the arm base
    const angle = armDirect.angleTo(ballDirect);
    const maxAngle = Math.PI / 5;

    //if the ball is within the cone ie the max angle and distance then the hand will grab the ball.
    if(distToBall < maxDist && angle < maxAngle){
      const localSpherePos = leftHandIK.parent.worldToLocal(spherePos);
      const handOffset = new THREE.Vector3(-1.0, 0, 0);
      leftHandIK.position.copy(localSpherePos.add(handOffset));
    }
    ikSolver.update();
  }
  
  requestAnimationFrame(update);
  renderer.render(scene, camera);

}

// Start the animation loop.
update();