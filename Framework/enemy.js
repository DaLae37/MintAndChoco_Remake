import * as THREE from 'three';
import * as Three from "./threejs.js"

export var mouseMixer = new THREE.AnimationMixer();

export function InitEnemy(){
    Three.FBXloader.load("Resources/Animations/mouse walk.FBX", function ( object ) {
        object.scale.set(0.01,0.01,0.01)
        object.position.set(0,0.3,0)
        mouseMixer = new THREE.AnimationMixer(object);
        const action = mouseMixer.clipAction( object.animations[0] );
        action.play();
      
        object.traverse( function ( child ) {
          if ( child.isMesh ) {
           child.castShadow = true;
           child.receiveShadow = true;
          }
        });
        Three.scene.add( object );
      });
}

export function UpdateEnemy(deltaTime){
    mouseMixer.update(deltaTime)
}