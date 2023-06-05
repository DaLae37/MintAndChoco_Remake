import * as THREE from 'three';
import * as Three from "./threejs.js";
import * as Map from "./map.js";
import * as Player from "./player.js"
import * as Enemy from "./enemy.js";
import * as Bullet from "./bullet.js";

const container = document.getElementById('container');
const keyStates = {};
const STEPS_PER_FRAME = 5;

Init();
function Init() {
  Three.InitThree();
  Map.InitMap();
  Player.InitPlayer();
  Enemy.InitEnemy();
  Bullet.InitBullet();

  container.appendChild(Three.renderer.domElement);
  Three.camera.position.set(0, 5, 0);
  Three.camera.updateMatrixWorld(true);

  InitEventListener();
  Update();
}

function Update() {
  const deltaTime = Math.min(0.05, Three.clock.getDelta()) / STEPS_PER_FRAME;

  for (var i = 0; i < STEPS_PER_FRAME; i++) {
    controls(deltaTime);
    Player.UpdatePlayer(deltaTime);
    Enemy.UpdateEnemy(deltaTime)
    Bullet.UpdateBullets(deltaTime);
  }
  Three.renderer.render(Three.scene, Three.camera);
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
  });

  document.addEventListener('mouseup', () => {
    if (document.pointerLockElement !== null) {
      Bullet.Shoot();
    }
  });

  document.body.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
      Three.camera.rotation.y -= event.movementX / 500;
      Three.camera.rotation.x -= event.movementY / 500;
    }
  });

  window.addEventListener('resize', () => {
    Three.camera.aspect = window.innerWidth / window.innerHeight;
    Three.camera.updateProjectionMatrix();
    Three.renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

function controls(deltaTime) {
  const playerSpeedDelta = deltaTime * Player.PLAYER_SPEED * (Player.playerOnFloor ? Player.PLAYER_SPEED : 1);

  if (keyStates['KeyW']) {
    Player.playerVelocity.add(Player.getForwardVector().multiplyScalar(playerSpeedDelta));
  }
  if (keyStates['KeyS']) {
    Player.playerVelocity.add(Player.getForwardVector().multiplyScalar(-playerSpeedDelta));
  }
  if (keyStates['KeyA']) {
    Player.playerVelocity.add(Player.getSideVector().multiplyScalar(-playerSpeedDelta));
  }
  if (keyStates['KeyD']) {
    Player.playerVelocity.add(Player.getSideVector().multiplyScalar(playerSpeedDelta));
  }
  if (Player.playerOnFloor) {
    if (keyStates['Space']) {
      Player.Jump();
    }
  }
}