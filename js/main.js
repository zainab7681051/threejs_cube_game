import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement); //appends the canvas for 3d

const controls = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh {
  //Box class for objects in the game
  constructor({
    width,
    height,
    depth,
    color,
    velocity = {
      x: 0,
      y: 0,
      z: 0,
    },
    position = {
      x: 0,
      y: 0,
      z: 0,
    },
  }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({
        color: color,
      })
    ); //calling the cunstructor of the parent class-THREE.mesh
    this.height = height;
    this.width = width;
    this.depth = depth;
    this.velocity = velocity;

    this.position.set(position.x, position.y, position.z);
    this.bottom = this.position.y - this.height / 2; //bottom value of the mesh object
    this.top = this.position.y + this.height / 2; //top value of the mesh object
    this.right = this.position.x + this.width / 2;
    this.left = this.position.x - this.width / 2;

    this.gravity = -0.002;
  }

  update(ground) {
    this.bottom = this.position.y - this.height / 2; //bottom value of the mesh object
    this.top = this.position.y + this.height / 2; //top value of the mesh object
    this.position.x += this.velocity.x;
    this.position.z += this.velocity.z;
    this.applyGravity(ground); //gravity on the y-axis
  }

  applyGravity(ground) {
    this.velocity.y += this.gravity; //object's speed increases when falling down due to gravity
    //predicting collision one frame before it actually occures
    if (this.bottom + this.velocity.y <= ground.top) {
      this.velocity.y += 0.8;
      this.velocity.y = -this.velocity.y; //reversing velocity-going down to going up so as to add bumping effect
    } else {
      this.position.y += this.velocity.y;
    }
  }
}
const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
  color: 0xff59c7,
  velocity: {
    x: 0,
    y: -0.1,
    z: 0,
  },
});
cube.castShadow = true;
scene.add(cube);

const ground = new Box({
  width: 5,
  height: 0.5,
  depth: 10,
  color: 0xd9d4d7,
  position: {
    x: 0,
    y: -2,
    z: 0,
  },
});
ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;
scene.add(light);
// camera.position.z = 5;
camera.position.z = 11.792347608815906;

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
};
window.addEventListener("keydown", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = true;
      break;
    case "KeyD":
      keys.d.pressed = true;
      break;
    case "KeyS":
      keys.s.pressed = true;
      break;
    case "KeyW":
      keys.w.pressed = true;
      break;
    default:
      // statements_def
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.code) {
    case "KeyA":
      keys.a.pressed = false;
      break;
    case "KeyD":
      keys.d.pressed = false;
      break;
    case "KeyS":
      keys.s.pressed = false;
      break;
    case "KeyW":
      keys.w.pressed = false;
      break;
    default:
      // statements_def
      break;
  }
});

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);

  cube.velocity.x = 0;
  cube.velocity.z = 0;

  if (keys.a.pressed) cube.velocity.x = -0.1;
  else if (keys.d.pressed) cube.velocity.x = 0.1;
  if (keys.s.pressed) cube.velocity.z = 0.1;
  else if (keys.w.pressed) cube.velocity.z = -0.1;

  cube.update(ground);
}
animate();
