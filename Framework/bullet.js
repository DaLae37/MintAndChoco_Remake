import * as THREE from 'three';
import * as Three from "./threejs.js";

var bulletTexture;
var bulletObjcet;
var bullets = new Array();
var bulletsDirections = new Array();
var bulletReady = false;

export let mouseTime = 0;

export function InitBullet() {
  LoadTexture();
  LoadObject();
}

function LoadTexture() {
  bulletTexture = Three.Textureloader.load("Resources/Models/bullet.png");
}

function LoadObject() {
  Three.OBJloader.load('Resources/Models/bullet.obj', (bullet) => {
    bullet.rotateY(THREE.MathUtils.degToRad(90));
    bullet.scale.set(0.01, 0.01, 0.01);
    bullet.position.set(0, 0, 0);
    bullet.updateWorldMatrix(true);
    bullet.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.material.map = bulletTexture;
      }
    });
    bulletObjcet = bullet.clone(true);
    bulletReady = true;
  });
}

export function Shoot() {
  if (bulletReady) {
    var bullet = bulletObjcet.clone(true);
    var bulletDirection = new THREE.Vector3();

    Three.camera.getWorldDirection(bulletDirection);
    bulletsDirections.push(bulletDirection);

    bullet.position.set(Three.camera.position.x, Three.camera.position.y, Three.camera.position.z);
    bullets.push(bullet);

    Three.scene.add(bullet);
  }
}

export function UpdateBullets(deltaTime) {
  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    var bulletDirection = bulletsDirections[i].clone(true);
    bullet.position.add(bulletDirection.multiplyScalar(deltaTime));
  }
}