import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';

import { Octree } from 'three/addons/math/Octree.js';
import { Capsule } from 'three/addons/math/Capsule.js';

export const OBJloader = new OBJLoader();
export const FBXloader = new FBXLoader();
export const Textureloader = new THREE.TextureLoader();
export const worldOctree = new Octree();

export const clock = new THREE.Clock();
export const scene = new THREE.Scene();
export const renderer = new THREE.WebGLRenderer({ antialias: true });
export const stats = new Stats();
export const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
export const fillLight1 = new THREE.HemisphereLight(0x4488bb, 0x002244, 0.5);
export const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);

export function InitThree() {
    InitRenderer()
    InitStats()
    InitScene()
    InitCamera()
    InitLight()
}

function InitRenderer() {
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
}

function InitStats() {
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '0px';
}

function InitScene() {
    scene.background = new THREE.Color(0x88ccee);
    scene.fog = new THREE.Fog(0x88ccee, 0, 50);
}

function InitCamera() {
    camera.rotation.order = 'YXZ';
}

function InitLight() {
    fillLight1.position.set(2, 1, 1);
    scene.add(fillLight1);

    directionalLight.position.set(- 5, 25, - 1);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top = 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;
    scene.add(directionalLight);
}