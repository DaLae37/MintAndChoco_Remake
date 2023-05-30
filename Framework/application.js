import * as THREE from 'three';
import * as Three from "./threejs.js"
import * as Map from "./map.js"
//import * as Player from "./player.js"
import * as Enemy from "./enemy.js"

const container = document.getElementById('container');
const keyStates = {};
let mouseTime = 0;
const STEPS_PER_FRAME = 5;

Init()
function Init() {
  Three.InitThree()
  Map.InitMap()
  Enemy.InitEnemy()
  container.appendChild(Three.renderer.domElement);
  container.appendChild(Three.stats.domElement);
  Three.camera.position.set(0,1,0);
  Three.camera.updateMatrixWorld(true);

  InitEventListener();

  Update();
}

function Update() {
  const deltaTime = Math.min(0.05, Three.clock.getDelta()) / STEPS_PER_FRAME;
  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for (var i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    //Player.updatePlayer(deltaTime);
    //updateSpheres(deltaTime);
    //teleportPlayerIfOob();
    //if (mixer) mixer.update(deltaTime);
  }

  Three.renderer.render(Three.scene, Three.camera);
  Three.stats.update();
  Three.controls.update();
  Enemy.UpdateEnemy(deltaTime)

  requestAnimationFrame(Update);
}

function InitEventListener() {
  document.addEventListener('keydown', (event) => {
    keyStates[event.code] = true;
  });

  document.addEventListener('keyup', (event) => {
    keyStates[event.code] = false;
  });

  container.addEventListener('mousedown', () => {
    document.body.requestPointerLock();
    mouseTime = performance.now();
  });

  document.addEventListener('mouseup', () => {
    if (document.pointerLockElement !== null) throwBall();
  });

  document.body.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
      camera.rotation.y -= event.movementX / 500;
      camera.rotation.x -= event.movementY / 500;
    }
  });

  window.addEventListener('resize', () => {
    //onWindowResize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function controls(deltaTime) {
  // gives a bit of air control
  const speedDelta = deltaTime * 25// * (playerOnFloor ? 25 : 8);
  if (keyStates['KeyW']) {
    //Player.playerVelocity.add(Player.getForwardVector().multiplyScalar(speedDelta));
  }
  if (keyStates['KeyS']) {
    //Player.playerVelocity.add(Player.getForwardVector().multiplyScalar(- speedDelta));
  }
  if (keyStates['KeyA']) {
    //Player.playerVelocity.add(Player.getSideVector().multiplyScalar(- speedDelta));
  }
  if (keyStates['KeyD']) {
    //Player.playerVelocity.add(Player.getSideVector().multiplyScalar(speedDelta));
  }
  //Three.camera.position.copy(Player.playerVelocity.clone().multiplyScalar(deltaTime));
  //if (!playerOnFloor) {
//    if (keyStates['Space']) {
  //    playerVelocity.y = 15;
   // }
  //}
}