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
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

class Box extends THREE.Mesh {
  constructor({ width, height, depth }) {
    super(
      new THREE.BoxGeometry(width, height, depth),
      new THREE.MeshStandardMaterial({ color: 0xff59c7 })
    ); //calling the cunstructor of the parent class-THREE.mesh
    this.height = height;
    this.width = width;
    this.depth = depth;
  }
}
const cube = new Box({
  width: 1,
  height: 1,
  depth: 1,
});
cube.castShadow = true;
scene.add(cube);

const groundGeometry = new THREE.BoxGeometry(5, 0.5, 10);
const groundGaterial = new THREE.MeshStandardMaterial({ color: 0xd9d4d7 });
const ground = new THREE.Mesh(groundGeometry, groundGaterial);
ground.position.y = -2;
ground.receiveShadow = true;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.y = 3;
light.position.z = 2;
light.castShadow = true;
scene.add(light);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
