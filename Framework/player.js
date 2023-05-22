import * as Three from "./threejs.js"

export let mixer;
export function SetAnimationMixer(object){
    mixer = new THREE.AnimationMixer(object);
}
FBXloader.load('Resources/Animations/cat walk.FBX', function ( object ) {
    object.scale.set(0.01,0.01,0.01)
    object.position.set(0,0.3,0)
    const action = mixer.clipAction( object.animations[ 0 ] );
    action.play();
  
    object.traverse( function ( child ) {
      if ( child.isMesh ) {
       child.castShadow = true;
       child.receiveShadow = true;
      }
    });
    scene.add( object );
  });

  
const GRAVITY = 30;
const playerCollider = new Capsule( new THREE.Vector3( 0, 0.35, 0 ), new THREE.Vector3( 0, 1, 0 ), 0.35 );

const playerVelocity = new THREE.Vector3();
const playerDirection = new THREE.Vector3();

let playerOnFloor = false;

const vector1 = new THREE.Vector3();
const vector2 = new THREE.Vector3();
const vector3 = new THREE.Vector3();

function throwBall() {

  const sphere = spheres[ sphereIdx ];

  camera.getWorldDirection( playerDirection );

  sphere.collider.center.copy( playerCollider.end ).addScaledVector( playerDirection, playerCollider.radius * 1.5 );

  // throw the ball with more force if we hold the button longer, and if we move forward

  const impulse = 15 + 30 * ( 1 - Math.exp( ( mouseTime - performance.now() ) * 0.001 ) );

  sphere.velocity.copy( playerDirection ).multiplyScalar( impulse );
  sphere.velocity.addScaledVector( playerVelocity, 2 );

  sphereIdx = ( sphereIdx + 1 ) % spheres.length;

}

function playerCollisions() {

  const result = worldOctree.capsuleIntersect( playerCollider );

  playerOnFloor = false;

  if ( result ) {

    playerOnFloor = result.normal.y > 0;

    if ( ! playerOnFloor ) {

      playerVelocity.addScaledVector( result.normal, - result.normal.dot( playerVelocity ) );

    }

    playerCollider.translate( result.normal.multiplyScalar( result.depth ) );

  }

}

function updatePlayer( deltaTime ) {

  let damping = Math.exp( - 4 * deltaTime ) - 1;

  if ( ! playerOnFloor ) {

    playerVelocity.y -= GRAVITY * deltaTime;

    // small air resistance
    damping *= 0.1;

  }

  playerVelocity.addScaledVector( playerVelocity, damping );

  const deltaPosition = playerVelocity.clone().multiplyScalar( deltaTime );
  playerCollider.translate( deltaPosition );

  playerCollisions();

  camera.position.copy( playerCollider.end );

}

function playerSphereCollision( sphere ) {

  const center = vector1.addVectors( playerCollider.start, playerCollider.end ).multiplyScalar( 0.5 );

  const sphere_center = sphere.collider.center;

  const r = playerCollider.radius + sphere.collider.radius;
  const r2 = r * r;

  // approximation: player = 3 spheres

  for ( const point of [ playerCollider.start, playerCollider.end, center ] ) {

    const d2 = point.distanceToSquared( sphere_center );

    if ( d2 < r2 ) {

      const normal = vector1.subVectors( point, sphere_center ).normalize();
      const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( playerVelocity ) );
      const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( sphere.velocity ) );

      playerVelocity.add( v2 ).sub( v1 );
      sphere.velocity.add( v1 ).sub( v2 );

      const d = ( r - Math.sqrt( d2 ) ) / 2;
      sphere_center.addScaledVector( normal, - d );

    }

  }

}

function spheresCollisions() {

  for ( let i = 0, length = spheres.length; i < length; i ++ ) {

    const s1 = spheres[ i ];

    for ( let j = i + 1; j < length; j ++ ) {

      const s2 = spheres[ j ];

      const d2 = s1.collider.center.distanceToSquared( s2.collider.center );
      const r = s1.collider.radius + s2.collider.radius;
      const r2 = r * r;

      if ( d2 < r2 ) {

        const normal = vector1.subVectors( s1.collider.center, s2.collider.center ).normalize();
        const v1 = vector2.copy( normal ).multiplyScalar( normal.dot( s1.velocity ) );
        const v2 = vector3.copy( normal ).multiplyScalar( normal.dot( s2.velocity ) );

        s1.velocity.add( v2 ).sub( v1 );
        s2.velocity.add( v1 ).sub( v2 );

        const d = ( r - Math.sqrt( d2 ) ) / 2;

        s1.collider.center.addScaledVector( normal, d );
        s2.collider.center.addScaledVector( normal, - d );

      }

    }

  }

}

function updateSpheres( deltaTime ) {

  spheres.forEach( sphere => {

    sphere.collider.center.addScaledVector( sphere.velocity, deltaTime );

    const result = worldOctree.sphereIntersect( sphere.collider );

    if ( result ) {

      sphere.velocity.addScaledVector( result.normal, - result.normal.dot( sphere.velocity ) * 1.5 );
      sphere.collider.center.add( result.normal.multiplyScalar( result.depth ) );

    } else {

      sphere.velocity.y -= GRAVITY * deltaTime;

    }

    const damping = Math.exp( - 1.5 * deltaTime ) - 1;
    sphere.velocity.addScaledVector( sphere.velocity, damping );

    playerSphereCollision( sphere );

  } );

  spheresCollisions();

  for ( const sphere of spheres ) {

    sphere.mesh.position.copy( sphere.collider.center );

  }

}

function getForwardVector() {

  camera.getWorldDirection( playerDirection );
  playerDirection.y = 0;
  playerDirection.normalize();

  return playerDirection;

}

function getSideVector() {

  camera.getWorldDirection( playerDirection );
  playerDirection.y = 0;
  playerDirection.normalize();
  playerDirection.cross( camera.up );

  return playerDirection;

}

function teleportPlayerIfOob() {

    if ( camera.position.y <= - 25 ) {
  
      playerCollider.start.set( 0, 1.35, 0 );
      playerCollider.end.set( 0, 2, 0 );
      playerCollider.radius = 0.35;
      camera.position.copy( playerCollider.end );
      camera.rotation.set( 0, 0, 0 );
  
    }
  
  }