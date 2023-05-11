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
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

const mainCubeGometry = new THREE.BoxGeometry(1, 1, 1);
const mainCubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff59c7 });
const cube = new THREE.Mesh(mainCubeGometry, mainCubeMaterial);
scene.add(cube);

const groundGeometry = new THREE.BoxGeometry(5, 0.5, 10);
const groundGaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
const ground = new THREE.Mesh(groundGeometry, groundGaterial);
ground.position.y = -2;
scene.add(ground);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.z = 3;
scene.add(light);
camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
