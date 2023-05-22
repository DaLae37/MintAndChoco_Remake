import * as THREE from 'three';
import * as Three from "./threejs.js"

const groundType = 4;
const groundNum = 30;

let groundObject = new Array(groundType);
let groundTexture = new Array(groundType);
var groundMesh = new Array(groundType);
var groundGeometry = new Array(groundType);

export function InitMap(){
  LoadGroundTexture()
  LoadGroundObject()
  CreateGround()
}

function LoadGroundTexture() {
  for (var i = 0; i< groundType; i++){
    const url = "Resources/Models/ground-" + String(i+1) + ".png";
    groundTexture[i] = Three.Textureloader.load(url);
  }
}

function LoadGroundObject() {
  for (var i = 0; i< groundType; i++){
    const url = "Resources/Models/ground-" + String(i+1) + ".obj";
    Three.OBJloader.load(url, (ground) => {
      ground.scale.set(0.01, 0.01, 0.01);
      ground.updateWorldMatrix(true);
      ground.traverse( function ( child ) {
        if ( child.isMesh ) {
         child.castShadow = true;
         child.receiveShadow = true;
         groundObject[i] = child.geometry;
        }
      });
    });
    var material = new THREE.MeshBasicMaterial();
    material.map = groundTexture[i];
    groundMesh[i] = new THREE.Mesh(groundObject[i], material);
    groundGeometry[i];
  }
}

function CreateGround() {
    for (var i = 0; i < groundNum; i++) {
      for (var j = 0; j < groundNum; j++) {
        const type = Math.floor(Math.random() * 4);
        var ground = groundMesh[type].clone(true);
        ground.position.set(i * 0.3 - 4.5, 0, j * 0.3 - 4.5);
        ground.updateWorldMatrix(true);
        groundGeometry[type] = Three.BufferGeometryUtils.mergeGeometries(ground.geometry, ground.matrix)
      }
    }

    for (var i = 0; i<groundType; i++){
      var grounds = new THREE.Mesh(groundGeometry[i], groundTexture[i]);
      //Three.worldOctree.fromGraphNode(grounds[i]);
      Three.scene.add(grounds[i]);
    }
}