//TODO: change velocity based on screen frame rate(diffrent screens have diffrent frame rate and refresh rate)
//TODO: change the enviroment into a highway traffic game or something like that

import * as THREE from "three";
import {
	OrbitControls
} from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
);

const renderer = new THREE.WebGLRenderer({
	alpha: true,
	antialias: true
});
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
		zAccelerate = false
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
		this.gravity = -0.03;
		this.zAccelerate = zAccelerate;
		this.bottom = this.position.y - this.height / 2; //bottom value of the mesh object
		this.top = this.position.y + this.height / 2; //top value of the mesh object
		this.right = this.position.x + this.width / 2;
		this.left = this.position.x - this.width / 2;
		this.front = this.position.z + this.depth / 2;
		this.back = this.position.z - this.depth / 2;
	}

	updateSides() {
		this.bottom = this.position.y - this.height / 2; //bottom value of the mesh object
		this.top = this.position.y + this.height / 2; //top value of the mesh object
		this.right = this.position.x + this.width / 2;
		this.left = this.position.x - this.width / 2;
		this.front = this.position.z + this.depth / 2;
		this.back = this.position.z - this.depth / 2;
	}
	update(ground) {
		this.updateSides();
		if (this.zAccelerate) this.velocity.z += 0.1 //enemy speed accelaration on the z-axis
		this.position.x += this.velocity.x;
		this.position.z += this.velocity.z;
		this.applyGravity(ground); //gravity on the y-axis
	}

	applyGravity(ground) {
		this.velocity.y += this.gravity; //object's speed increases when falling down due to gravity
		if (
			boxCollision({
				box1: this,
				box2: ground,
			})
		) {
			const friction = 0.2
			this.velocity.y *= friction; //apllying friction; cube bounces off of the ground couple of times after colliding but eventually stops due to friction
			this.velocity.y = -this.velocity.y; //reversing velocity from going down to going up so as to add the bouncing effect
		} else {
			this.position.y += this.velocity.y;
		}
	}
}

function boxCollision({
	box1,
	box2
}) {
	//detect for collision
	const xCollision = box1.right >= box2.left && box1.left <= box2.right;
	const yCollision =
		box1.bottom + box1.velocity.y <= box2.top && box1.top >= box2.bottom; //box1.bottom + box1.velocity.y is for predicting collison on the y-axis one frame before it happens so there will not be any overflow between the bottom of the cube and top of the ground
	const zCollision = box1.front >= box2.back && box1.back <= box2.front;
	if (xCollision && yCollision && zCollision) {
		return true;
	}
}

const cube = new Box({
	width: 1,
	height: 1,
	depth: 1,
	color: 0xff59c7,
	velocity: {
		x: 0,
		y: -0.4,
		z: 0,
	},
});
cube.castShadow = true;
scene.add(cube);

const ground = new Box({
	width: 10,
	height: 0.5,
	depth: 50,
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
light.position.z = 1;
light.castShadow = true;
scene.add(light);

scene.add(new THREE.AmbientLight(0xffffff, 0.5))
// camera.position.z = 5;
// camera.position.z = 11.792347608815906;
camera.position.set(4.62, 2.74, 8)


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
	case "Space":
		cube.velocity.y = 0.3;
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
		break;
	}
});


const enemies = [];
let frames = 0;
let spawnRate = 80;

function animate() {
	const animationId = requestAnimationFrame(animate);
	renderer.render(scene, camera);

	cube.velocity.x = 0;
	cube.velocity.z = 0;

	if (keys.a.pressed) cube.velocity.x = -0.5;
	else if (keys.d.pressed) cube.velocity.x = 0.5;
	if (keys.s.pressed) cube.velocity.z = 0.5;
	else if (keys.w.pressed) cube.velocity.z = -0.5;

	cube.update(ground);
	enemies.forEach((enemy) => {
		enemy.update(ground);
		if (boxCollision({
				box1: cube,
				box2: enemy
			})) {
			cancelAnimationFrame(animationId);
		}
	});

	if (frames % spawnRate === 0)
	{
		if (spawnRate > 20) spawnRate -= 20
		const enemy = new Box({
			width: 1,
			height: 1,
			depth: 1,
			color: 0xff3131,
			position: {
				x: (Math.random() - 0.5) * 9,
				y: 0,
				z: -20,
			},
			velocity: {
				x: 0,
				y: -0.4,
				z: 0.05,
			},
			zAccelerate: true
		});

		enemy.castShadow = true;
		scene.add(enemy);
		enemies.push(enemy);
	}
	frames++;
}
animate();