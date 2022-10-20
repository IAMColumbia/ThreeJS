import * as THREE from "three"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from "dat.gui"
import background1 from "../img/background.jpg"; //https://www.wikiart.org/en/pierre-auguste-renoir/woman-at-the-garden-1873

var height = window.innerHeight;
var width = window.innerWidth;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(width, height);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
const orbit = new OrbitControls(camera, renderer.domElement);
camera.position.set(-10, 30, 30);
orbit.update();

const textureLoader = new THREE.TextureLoader();
scene.background = textureLoader.load(background1);
// const cubeLoader = new THREE.CubeTextureLoader();
// scene.background = cubeLoader.load(background1, background1, background1, background1, background1, background1)

scene.fog = new THREE.Fog(0xffffff, .1, 200);

const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

const gridHelper = new THREE.GridHelper(30);
scene.add(gridHelper);


const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.7);
// directionalLight.position.set(-20, 20, 0);
// directionalLight.castShadow = true;
// scene.add(directionalLight);

// const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight);
// scene.add(dirLightHelper);

// const dirShadowHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(dirShadowHelper);

const spotLight = new THREE.SpotLight(0xffffff, 0.7);
spotLight.position.set(10, 10, 0);
scene.add(spotLight);

const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

const boxGeo = new THREE.BoxGeometry();
const boxMax = new THREE.MeshStandardMaterial({color: 0x00FF00});
const box = new THREE.Mesh(boxGeo, boxMax);
scene.add(box);

const planeGeo = new THREE.PlaneGeometry(30, 30);
const planeMax = new THREE.MeshStandardMaterial({color: 0xFFFFFF});
const plane = new THREE.Mesh(planeGeo, planeMax);
plane.rotation.x = -0.5 * Math.PI;
plane.receiveShadow = true;
scene.add(plane);

const sphereGeo = new THREE.SphereGeometry(4, 36, 36);
const sphereMat = new THREE.MeshStandardMaterial({color: 0x00FF00, wireframe: false});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.set(5,5);
sphere.castShadow = true;
scene.add(sphere);

const gui = new dat.GUI();
const guiOptions = {
    SphereColor: "#0000FF",
    wireframe: true,
    speed: 0.02,
    angle: 0.1,
    penumbra: 0.1,
    intensity: 0.1
};

gui.addColor(guiOptions, "SphereColor").onChange(function(e){
    sphere.material.color.set(e);
});
gui.add(guiOptions, "wireframe").onChange(function(e){
    sphere.material.wireframe = e;
});
gui.add(guiOptions, "speed", 0.01, 0.1);
gui.add(guiOptions, "angle", 0, 1);
gui.add(guiOptions, "penumbra", 0, 1);
gui.add(guiOptions, "intensity", 0, 1);

var angle = 0;

function animate(time)
{
    box.rotation.x = time / 1000;
    box.rotation.y = time / 1000;

    spotLight.angle = guiOptions.angle;
    spotLight.penumbra = guiOptions.penumbra;
    spotLight.intensity = guiOptions.intensity;
    spotLightHelper.update();

    angle += guiOptions.speed;
    sphere.position.y = 5 * Math.abs(Math.sin(angle));

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);