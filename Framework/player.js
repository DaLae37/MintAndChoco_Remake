import * as THREE from 'three';
import * as Three from "./threejs.js"

export const PLAYER_GRAVITY = 30;
export const PLAYER_SPEED = 3;

export const playerVelocity = new THREE.Vector3();
export const playerDirection = new THREE.Vector3();
export var playerOnFloor = false;
export var player;
var playerReady = false;

var catMixer = new THREE.AnimationMixer();

export function InitPlayer() {
  Three.FBXloader.load("Resources/Animations/cat walk.FBX", function (cat) {
    cat.scale.set(0.01, 0.01, 0.01)
    cat.position.set(1, 0.3, 1)
    catMixer = new THREE.AnimationMixer(cat);
    const action = catMixer.clipAction(cat.animations[0]);
    action.play();

    cat.traverse(function (child) {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    player = cat;
    playerReady = true;
    Three.scene.add(cat);
  });
}

export function UpdatePlayer(deltaTime) {
  if (playerReady) {
    let damping = Math.exp(- 4 * deltaTime) - 1;
    if (!playerOnFloor) {
      playerVelocity.y -= PLAYER_GRAVITY * deltaTime;
      damping *= 0.1;
      if (player.position.y < 0.3) {
        playerVelocity.y = 0;
        player.position.y = 0.3;
        playerOnFloor = true;
      }
    }
    playerVelocity.addScaledVector(playerVelocity, damping);
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime);
    player.position.add(deltaPosition);
    Three.camera.position.set(player.position.x, player.position.y + 0.4, player.position.z);
  }
}

export function Jump() {
  playerVelocity.y = 5;
  playerOnFloor = false;
}

export function getForwardVector() {
  Three.camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  return playerDirection;

}

export function getSideVector() {
  Three.camera.getWorldDirection(playerDirection);
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross(Three.camera.up);
  return playerDirection;
}