import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as Three from "./threejs.js"

const groundType = 4;
const groundNum = 30;

const obstacleType = 2;
const obstacleNum = 10;

var groundMaterial = new Array();
var groundGeometry = new Array();
var groundGeometries = new Array(groundType);
var groundMesh = new Array(groundType);
var loadingGroundFlag = 0;

var obstacleMaterial = new Array();
var obstacleGeometry = new Array()
var obstacleGeometries = new Array(obstacleType);
var obstacleMesh = new Array(groundType);
var loadingObstacleFlag = 0;

export function InitMap(){
  LoadGroundTexture()
  LoadGroundObject()
  LoadObstacleTexture()
  LoadObstacleObject()
}

function LoadObstacleTexture(){
  var texture = Three.Textureloader.load("Resources/Models/rock.png");
  var material = new THREE.MeshBasicMaterial();
  material.map = texture;
  obstacleMaterial.push(material.clone(true));

  texture = Three.Textureloader.load("Resources/Models/tree.png");
  material = new THREE.MeshBasicMaterial();
  material.map = texture;
  obstacleMaterial.push(material.clone(true));
}

function LoadObstacleObject(){
    Three.OBJloader.load("Resources/Models/rock.obj", (obstacle) => {
      obstacle.traverse( function ( child ) {
        if ( child.isMesh ) {
         child.castShadow = true;
         child.receiveShadow = true;
         obstacleGeometry.push(child.geometry.clone());
        }
      });
      obstacleGeometries[loadingObstacleFlag] = new Array();
      loadingObstacleFlag+=1;
      CreateObstacle();
    });

    Three.OBJloader.load("Resources/Models/tree.obj", (obstacle) => {
      obstacle.traverse( function ( child ) {
        if ( child.isMesh ) {
         child.castShadow = true;
         child.receiveShadow = true;
         obstacleGeometry.push(child.geometry.clone());
        }
      });
      obstacleGeometries[loadingObstacleFlag] = new Array();
      loadingObstacleFlag+=1;
      CreateObstacle();
    });
  }

function CreateObstacle(){
  if(loadingObstacleFlag == obstacleType){
    for (var i = 0; i < obstacleNum; i++) {
      const type = Math.floor(Math.random() * 2);
      const x = Math.random() * 8 - 4;
      const z = Math.random() * 8 - 4;
      var geometry = obstacleGeometry[type].clone();
      var object = new THREE.Object3D();
      object.scale.set(0.01,0.01,0.01);
      object.position.set(x, 0.3, z);
      object.updateWorldMatrix(true);
      geometry.applyMatrix4(object.matrixWorld);
      obstacleGeometries[type].push(geometry);
    }
    for (var i = 0; i<obstacleType; i++){
      var mergeObstacle =  BufferGeometryUtils.mergeGeometries(obstacleGeometries[i], false);
      obstacleMesh[i] = new THREE.Mesh(mergeObstacle, obstacleMaterial[i]);
      Three.scene.add(obstacleMesh[i]);
    }
  }
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
      loadingGroundFlag+=1;
      CreateGround();
    });
    groundGeometries[i] = new Array();
  }
}

function CreateGround() {
  if(loadingGroundFlag == groundType){
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