import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as Three from "./threejs.js"

const groundType = 4;
const groundNum = 30;

var groundMaterial = new Array();
var groundGeometry = new Array();
var groundGeometries = new Array(groundType);
var groundMesh = new Array(groundType);

var loadingFlag = 0;

export function InitMap(){
  LoadGroundTexture()
  LoadGroundObject()
}

function LoadGroundTexture() {
  for (var i = 0; i< groundType; i++){
    const url = "Resources/Models/ground-" + String(i+1) + ".png";
    var texture = Three.Textureloader.load(url);
    var material = new THREE.MeshBasicMaterial();
    material.map = texture;
    groundMaterial.push(material);
  }
}

function LoadGroundObject() {
  for (var i = 0; i< groundType; i++){
    const url = "Resources/Models/ground-" + String(i+1) + ".obj";
    Three.OBJloader.load(url, (ground) => {
      ground.traverse( function ( child ) {
        if ( child.isMesh ) {
         child.castShadow = true;
         child.receiveShadow = true;
         groundGeometry.push(child.geometry.clone());
        }
      });
      loadingFlag+=1;
      CreateGround();
    });
    groundGeometries[i] = new Array();
  }
}

function CreateGround() {
  if(loadingFlag == groundType){
    for (var i = 0; i < groundNum; i++) {
      for (var j = 0; j < groundNum; j++) {
        const type = Math.floor(Math.random() * 4);
        var geometry = groundGeometry[type].clone();
        var object = new THREE.Object3D();
        object.scale.set(0.01,0.01,0.01);
        object.position.set(i * 0.3 - 4.5, 0, j * 0.3 - 4.5);
        object.updateWorldMatrix(true);
        geometry.applyMatrix4(object.matrixWorld);
        groundGeometries[type].push(geometry);
      }
    }

    for (var i = 0; i<groundType; i++){
      var mergeGround =  BufferGeometryUtils.mergeGeometries(groundGeometries[i], false);
      groundMesh[i] = new THREE.Mesh(mergeGround, groundMaterial[i]);
      Three.scene.add(groundMesh[i]);
    }
  } 
}