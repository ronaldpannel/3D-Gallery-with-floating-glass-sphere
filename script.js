import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const startScreen = document.getElementById("container");
const enterBtn = document.getElementById("enterBtn");

let renderer, camera, scene, pointerControl, orbitControls;

scene = new THREE.Scene({ antialize: true });

const loader = new GLTFLoader();

camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 22;

renderer = new THREE.WebGLRenderer();
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);
// orbitControls = new OrbitControls(camera, renderer.domElement);
pointerControl = new PointerLockControls(camera, document.body);

//create sphere

const sphereGeo = new THREE.SphereGeometry(2.5, 50, 50);
const sphereMat = new THREE.MeshPhysicalMaterial({
  roughness: 0,
  metalness: 0.0,
  color: 0xa8edeb,
  transmission: 1,
  ior: 2.3,
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.y = -Math.PI * 3;
sphere.position.z = 5;
scene.add(sphere);

//create floor
const texture = new THREE.TextureLoader().load("WoodFloor.png");
const floorMAt = new THREE.MeshStandardMaterial({ map: texture });
const floorGeo = new THREE.PlaneGeometry(50, 50);
const floor = new THREE.Mesh(floorGeo, floorMAt);
floor.castShadow = false;
floor.receiveShadow = true;
floor.rotation.x = -Math.PI / 2;
floor.position.y = -Math.PI * 3;
scene.add(floor);

//create walls
const BackWallTexture = new THREE.TextureLoader().load("WallText.webp");
const backWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const backWallMat = new THREE.MeshStandardMaterial({ map: BackWallTexture });
const backWall = new THREE.Mesh(backWallGeo, backWallMat);
backWall.castShadow = true;
backWall.receiveShadow = true;
backWall.position.z = -20;

//create left wall
const LeftWallTexture = new THREE.TextureLoader().load("WallText.webp");
const leftWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const leftWallMat = new THREE.MeshStandardMaterial({ map: LeftWallTexture });
const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
leftWall.castShadow = true;
leftWall.receiveShadow = true;
leftWall.rotation.y = Math.PI / 2;
leftWall.position.x = -20;

//create right Wall
const rightWallTexture = new THREE.TextureLoader().load("WallText.webp");
const rightWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const rightWallMat = new THREE.MeshStandardMaterial({ map: rightWallTexture });
const rightWall = new THREE.Mesh(rightWallGeo, rightWallMat);
rightWall.castShadow = true;
rightWall.receiveShadow = true;
rightWall.rotation.y = Math.PI / 2;
rightWall.position.x = 20;

//create front wall
const frontWallTexture = new THREE.TextureLoader().load("WallText.webp");
const frontWallGeo = new THREE.BoxGeometry(50, 20, 0.001);
const frontWallMat = new THREE.MeshStandardMaterial({ map: frontWallTexture });
const frontWall = new THREE.Mesh(frontWallGeo, frontWallMat);
frontWall.castShadow = true;
frontWall.receiveShadow = true;
frontWall.position.z = 25;

// create celling
const cellingTexture = new THREE.TextureLoader().load("OfficeCeiling.png");
const cellingMAt = new THREE.MeshStandardMaterial({ map: cellingTexture });
const cellingGeo = new THREE.PlaneGeometry(50, 50);
const celling = new THREE.Mesh(cellingGeo, cellingMAt);
celling.castShadow = true;
celling.receiveShadow = true;
celling.rotation.x = Math.PI / 2;
celling.position.y = 10;
scene.add(celling);

const wallGroup = new THREE.Group();
wallGroup.add(backWall);
wallGroup.add(leftWall);
wallGroup.add(rightWall);
wallGroup.add(frontWall);

//create collision bounding box for each wall
for (let i = 0; i < wallGroup.children.length; i++) {
  wallGroup.children[i].BoundingBox = new THREE.Box3();
  wallGroup.children[i].BoundingBox.setFromObject(wallGroup.children[i]);
}
function checkCollision() {
  const playerBoundingBox = new THREE.Box3();
  const cameraWorldPosition = new THREE.Vector3();
  camera.getWorldPosition(cameraWorldPosition);
  playerBoundingBox.setFromCenterAndSize(
    cameraWorldPosition,
    new THREE.Vector3(1, 1, 1)
  );

  for (let i = 0; i < wallGroup.children.length; i++) {
    const wall = wallGroup.children[i];
    if (playerBoundingBox.intersectsBox(wall.BoundingBox)) {
      return true;
    }
  }
  return false;
}
scene.add(wallGroup);

//create lights
const ambLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambLight);

const directionalLight = new THREE.DirectionalLight(0xfffffff, 1.2);
directionalLight.position.set(0, 0, 0);
directionalLight.castShadow = true;
directionalLight.shadow.bias = -0.0001;
scene.add(directionalLight);

const targetObject = new THREE.Object3D();
targetObject.position.set(0, 0, 3);
scene.add(targetObject);
directionalLight.target = targetObject;
// const helper = new THREE.DirectionalLightHelper(directionalLight, 5);
// scene.add(helper);

const directionalLight1 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight1.position.set(0, 0, 0);
directionalLight1.castShadow = true;
directionalLight1.shadow.bias = -0.0001;
scene.add(directionalLight1);

const targetObject1 = new THREE.Object3D();
targetObject1.position.set(0, 0, -3);
scene.add(targetObject1);
directionalLight1.target = targetObject1;
// const helper1 = new THREE.DirectionalLightHelper(directionalLight1, 5);
// scene.add(helper1);

const directionalLight2 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight2.position.set(0, 0, 0);
directionalLight2.rotation.x = Math.PI / 2;
directionalLight2.castShadow = true;
directionalLight2.shadow.bias = -0.0001;
scene.add(directionalLight2);

const targetObject2 = new THREE.Object3D();
targetObject2.position.set(3, 0, 0);
scene.add(targetObject2);

directionalLight2.target = targetObject2;
// const helper2 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(helper2);

const directionalLight3 = new THREE.DirectionalLight(0xffffff, 1);
directionalLight3.position.set(4, 0, 0);
directionalLight3.rotation.x = Math.PI / 2;
directionalLight3.castShadow = true;
directionalLight3.shadow.bias = -0.0001;
scene.add(directionalLight3);

const targetObject3 = new THREE.Object3D();
targetObject3.position.set(-3, 0, 0);
scene.add(targetObject3);
directionalLight3.target = targetObject3;

// const helper3 = new THREE.DirectionalLightHelper(directionalLight2, 5);
// scene.add(helper3);

//create Paintings
function createPainting(imageUrl, width, height, position) {
  const textureLoader = new THREE.TextureLoader();
  const paintingTexture = textureLoader.load(imageUrl);
  const paintingMat = new THREE.MeshBasicMaterial({ map: paintingTexture });
  const paintingGeo = new THREE.PlaneGeometry(width, height);
  const painting = new THREE.Mesh(paintingGeo, paintingMat);
  painting.position.set(position.x, position.y, position.z);
  return painting;
}
const photo1 = createPainting(
  "chase.jpeg",
  5,
  10,
  new THREE.Vector3(-10, 0, -19)
);
scene.add(photo1);

const photo2 = createPainting(
  "rose.jpeg",
  5,
  10,
  new THREE.Vector3(0, 0, -19.99)
);
scene.add(photo2);

const photo3 = createPainting(
  "ralph.jpeg",
  5,
  10,
  new THREE.Vector3(10, 0, -19.99)
);
scene.add(photo3);

const photo4 = createPainting(
  "erin.jpeg",
  5,
  10,
  new THREE.Vector3(19.99, 0, -8.99)
);
photo4.rotation.y = -Math.PI / 2;
scene.add(photo4);

const photo5 = createPainting(
  "nora.jpeg",
  5,
  10,
  new THREE.Vector3(19.99, 0, 4)
);
photo5.rotation.y = -Math.PI / 2;
scene.add(photo5);

const photo6 = createPainting(
  "neve.jpeg",
  5,
  9,
  new THREE.Vector3(19.99, 0, 16)
);
photo6.rotation.y = -Math.PI / 2;
scene.add(photo6);

const photo7 = createPainting(
  "nora and neve.jpeg",
  5,
  8,
  new THREE.Vector3(10.99, -0, 24.99)
);
photo7.rotation.y = -Math.PI;
scene.add(photo7);

const photo8 = createPainting(
  "Vicky.jpeg",
  5,
  10,
  new THREE.Vector3(-0.5, -0, 24.99)
);
photo8.rotation.y = -Math.PI;
scene.add(photo8);

const photo9 = createPainting(
  "nicola.jpeg",
  5,
  10,
  new THREE.Vector3(-10.99, 0, 24.99)
);
photo9.rotation.y = -Math.PI;
scene.add(photo9);

const photo10 = createPainting(
  "Archie.jpeg",
  6,
  12,
  new THREE.Vector3(-19.9, 0, -10)
);
photo10.rotation.y = Math.PI / 2;
scene.add(photo10);

const photo11 = createPainting(
  "Rita.jpeg",
  6,
  12,
  new THREE.Vector3(-19.9, 0, 3)
);
photo11.rotation.y = Math.PI / 2;
scene.add(photo11);

const photo12 = createPainting(
  "Doug.jpeg",
  6,
  12,
  new THREE.Vector3(-19.9, 0, 16)
);
photo12.rotation.y = Math.PI / 2;
scene.add(photo12);
//start and stop gallery entry

enterBtn.addEventListener("click", (e) => {
  e.preventDefault();
  startExperience();
});
enterBtn.addEventListener("touchstart", () => {
  startExperience();
});

function startExperience() {
  hideMenu();
  pointerControl.lock();
}

function hideMenu() {
  startScreen.style.display = "none";
}
function showMenu() {
  startScreen.style.display = "block";
}

//key control
const keyPressed = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false,
  r: false,
};

document.addEventListener(
  "keydown",
  (e) => {
    if (e.key in keyPressed) {
      keyPressed[e.key] = true;
    }
  },
  false
);

document.addEventListener(
  "keyup",
  (e) => {
    if (e.key in keyPressed) {
      keyPressed[e.key] = false;
    }
  },
  false
);

const clock = new THREE.Clock();

function updateMovement(delta) {
  const moveSpeed = 5 * delta;
  const previousPosition = camera.position.clone();

  if (keyPressed.ArrowRight || keyPressed.d) {
    pointerControl.moveRight(moveSpeed);
  }
  if (keyPressed.ArrowLeft || keyPressed.a) {
    pointerControl.moveRight(-moveSpeed);
  }
  if (keyPressed.ArrowUp || keyPressed.w) {
    pointerControl.moveForward(moveSpeed);
  }
  if (keyPressed.ArrowDown || keyPressed.s) {
    pointerControl.moveForward(-moveSpeed);
  }
  if (keyPressed.r) {
    showMenu();
    pointerControl.unlock();
  }
  if (checkCollision()) {
    camera.position.copy(previousPosition);
  }
}

let render = function () {
  const delta = clock.getDelta();
  updateMovement(delta);
  sphere.rotation.y += 0.015;
  sphere.position.y += 0.02;

  if(sphere.position.y > 12){
     sphere.position.y *= -1
  }

  console.log(sphere.position.y);
  renderer.render(scene, camera);
  requestAnimationFrame(render);
};

render();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
