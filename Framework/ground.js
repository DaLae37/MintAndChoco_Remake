import * as Three from "./threejs.js"

const groundType = 4
const groundNum = 30;
let groundObject = new Array(groundType)
let ground;
var loadNum = 0
function CreateGround(){
  if(loadNum < groundType - 1){
      loadNum+=1
      return;
    }
  else{
  ground = new Array(groundNum);
  for (var i = 0; i < groundNum; i++){
  ground[i] = new Array(groundNum);
  for(var j = 0; j < groundNum; j++){
      ground[i][j] = groundObject[Math.floor(Math.random() * 4)].clone(true);
      ground[i][j].position.set(i * 0.3 - 4.5, 0, j * 0.3 - 4.5)
      ground[i][j].updateWorldMatrix(true)
      scene.add(ground[i][j])
      worldOctree.fromGraphNode( ground[i][j] );
    }
  }
}
}

function LoadGrounTexture(){
  var texture = new THREE.TextureLoader().load("Resources/Models/ground-1.png");
  var texture = new THREE.TextureLoader().load("Resources/Models/ground-2.png");
}

function LoadGroundObject(){
  OBJLoader.load('Resources/Models/ground-1.obj', (ground) => {
    ground.scale.set(0.01,0.01,0.01);
    ground.updateWorldMatrix(true);
    groundObject[0] = ground
    CreateGround()
  } );
  
  OBJLoader.load('Resources/Models/ground-2.obj', (ground) => {
    ground.scale.set(0.01,0.01,0.01);
    ground.updateWorldMatrix(true);
    groundObject[1] = ground
    CreateGround()
  } );
  
  OBJLoader.load('Resources/Models/ground-3.obj', (ground) => {
    ground.scale.set(0.01,0.01,0.01);
    ground.updateWorldMatrix(true);
    groundObject[2] = ground
    CreateGround()
  } );
  
  OBJLoader.load('Resources/Models/ground-4.obj', (ground) => {
    ground.scale.set(0.01,0.01,0.01);
    ground.updateWorldMatrix(true);
    groundObject[3] = ground
    CreateGround()
  } );
}
LoadGroundObject()