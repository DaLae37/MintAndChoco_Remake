import * as Three from "./threejs.js"
import * as Ground from "./ground.js"
import * as Player from "./player.js"

const container = document.getElementById('container');
const keyStates = {};
let mouseTime = 0;
const STEPS_PER_FRAME = 5;

function Init(){
  Three.InitThree()
  container.appendChild( Three.renderer.domElement );
  container.appendChild( Three.stats.domElement );

  InitEventListener();

  Update();
}

function Update() {
  const deltaTime = Math.min( 0.05, Three.clock.getDelta() ) / STEPS_PER_FRAME;
  // we look for collisions in substeps to mitigate the risk of
  // an object traversing another too quickly for detection.

  for ( var i = 0; i < STEPS_PER_FRAME; i ++ ) {
    controls( deltaTime );
    updatePlayer( deltaTime );
    updateSpheres( deltaTime );
    teleportPlayerIfOob();
    if (mixer) mixer.update( deltaTime );
  }

  Three.renderer.render( Three.scene, Three.camera );
  Three.stats.update();
  requestAnimationFrame(Update);
}

function InitEventListener(){
  document.addEventListener( 'keydown', ( event ) => {
    keyStates[ event.code ] = true;
  } );
  
  document.addEventListener( 'keyup', ( event ) => {
    keyStates[ event.code ] = false;
  } );
  
  container.addEventListener( 'mousedown', () => {
    document.body.requestPointerLock();
    mouseTime = performance.now();
  } );
  
  document.addEventListener( 'mouseup', () => {
    if ( document.pointerLockElement !== null ) throwBall();
  } );
  
  document.body.addEventListener( 'mousemove', ( event ) => {
    if ( document.pointerLockElement === document.body ) {
      camera.rotation.y -= event.movementX / 500;
      camera.rotation.x -= event.movementY / 500;
    }
  } );
  
  window.addEventListener('resize', ()=>{
    //onWindowResize
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
  });
}

function controls( deltaTime ) {
  // gives a bit of air control
  const speedDelta = deltaTime * ( playerOnFloor ? 25 : 8 );
  if ( keyStates[ 'KeyW' ] ) {
    playerVelocity.add( getForwardVector().multiplyScalar( speedDelta ) );
  }
  if ( keyStates[ 'KeyS' ] ) {
    playerVelocity.add( getForwardVector().multiplyScalar( - speedDelta ) );
  }
  if ( keyStates[ 'KeyA' ] ) {
    playerVelocity.add( getSideVector().multiplyScalar( - speedDelta ) );
  }
  if ( keyStates[ 'KeyD' ] ) {
    playerVelocity.add( getSideVector().multiplyScalar( speedDelta ) );
  }
  if ( !playerOnFloor ) {
    if ( keyStates[ 'Space' ] ) {
      playerVelocity.y = 15;
    }
  }
}