//use ctrl c to stop the program running and gain control of the console
//ThreeJS is a Y-up platform
//use f12 on website to debug
//use "npm init -y" to create package.json
//use "npm i parcel" to create node-modules
//use "npm install three" to install threejs library
//to run type "parcel ./src/index.html"

import * as THREE from "three";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import * as CANNON from 'cannon-es';
import { Vec3, World } from "cannon-es";
import { Mesh, PlaneGeometry } from "three";


const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1,1000);
camera.position.set(-10,30,30);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.update();
scene.add(camera);

const light = new THREE.DirectionalLight( 0xFFFFFF );
light.castShadow = true;
scene.add(light);

const ambLight = new THREE.AmbientLight(0x404040);
scene.add(ambLight);

const axisHelper = new THREE.AxesHelper(20);
scene.add(axisHelper);

const mousePos = new THREE.Vector2();
const intersectPt = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();
const spheres = [];
const bodies = [];
//--------------M ouseMove -----

window.addEventListener('mousemove', function(e){
    mousePos.x = (e.clientX / window.innerWidth) * 2 -1;
    mousePos.y = -(e.clientY / window.innerHeight) * 2 +1;

    planeNormal.copy(camera.position).normalize();

    plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);

    raycaster.setFromCamera(mousePos, camera);
    raycaster.ray.intersectPlane(plane, intersectPt);
});

var makecube = true;

window.addEventListener('click', function(e){

    if(makecube){
        const cubeGeo = new THREE.BoxGeometry(.4,.4, .4);
        const cubeMat = new THREE.MeshStandardMaterial({color: Math.random() * 0xffea00, metalness: 0, roughness: 0});
        const cube = new Mesh(cubeGeo, cubeMat);
        cube.castShadow = true;
        scene.add(cube);
        cube.position.copy(intersectPt);
        const cubePMat = new CANNON.Material();
        const cubeBody = new CANNON.Body({
        shape: new CANNON.Box(new CANNON.Vec3(.2,.2,.2)),
        mass: 3,
        position : new CANNON.Vec3(intersectPt.x, intersectPt.y, intersectPt.z),
        material: cubePMat
        })
        world.addBody(cubeBody);
        spheres.push(cube);
        bodies.push(cubeBody);
        makecube = false;
    }
    else{
        const sphereGeo = new THREE.SphereGeometry(.25,30,30);
        const sphereMat = new THREE.MeshStandardMaterial({color: Math.random() * 0xffea00, metalness: 0, roughness: 0});
        const sphere = new THREE.Mesh(sphereGeo, sphereMat);
        sphere.castShadow = true;
        scene.add(sphere);
        sphere.position.copy(intersectPt);
        const spherePMat = new CANNON.Material();
        const sphereBody = new CANNON.Body({
        shape: new CANNON.Sphere(0.123),
        mass: 3,
        position : new CANNON.Vec3(intersectPt.x, intersectPt.y, intersectPt.z),
        material: spherePMat
    });
    world.addBody(sphereBody);
    const planeSphereContact = new CANNON.ContactMaterial(
        planePMat,
        spherePMat,
        {restitution: 0.7}
    );
    world.addContactMaterial(planeSphereContact);
    spheres.push(sphere);
    bodies.push(sphereBody);
    makecube = true;
    }
    
    
});

const world = new CANNON.World({
    gravity: new CANNON.Vec3(0,-10,0)
});
const planeGeo = new THREE.PlaneGeometry(10,10);
const planeMat = new THREE.MeshStandardMaterial({color:0xeeeeee, side: THREE.DoubleSide});
const groundPlane = new THREE.Mesh(planeGeo, planeMat);
groundPlane.receiveShadow = true;
scene.add(groundPlane);


const planePMat = new CANNON.Material();
const planeBody = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,5,.1)),
    material: planePMat
});

planeBody.quaternion.setFromEuler(-Math.PI/2,0,0);
world.addBody(planeBody);

const borders = [];
const borderBodies = [];
//#region border
const side1Geo = new THREE.PlaneGeometry(10,2);
const side1Mat = new THREE.MeshStandardMaterial({color:0xeeeeee, side: THREE.DoubleSide});
const side1 = new THREE.Mesh(side1Geo, side1Mat);
side1.position.set(0, 2, 5);
const side1Body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,1,.1)),
    material: planePMat
})
side1Body.position.set(0, 1, 5);
world.addBody(side1Body);
scene.add(side1);
borders.push(side1);
borderBodies.push(side1Body);

const side2Geo = new THREE.PlaneGeometry(10,2);
const side2Mat = new THREE.MeshStandardMaterial({color:0xeeeeee, side: THREE.DoubleSide});
const side2 = new THREE.Mesh(side2Geo, side2Mat);
const side2Body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,1,.1)),
    material: planePMat
})
side2Body.position.set(5, 1, 0)
side2Body.quaternion.setFromEuler(0,Math.PI/2,0);
scene.add(side2);
world.addBody(side2Body);
borders.push(side2);
borderBodies.push(side2Body);

const side3Geo = new THREE.PlaneGeometry(10,2);
const side3Mat = new THREE.MeshStandardMaterial({color:0xeeeeee, side: THREE.DoubleSide});
const side3 = new THREE.Mesh(side3Geo, side3Mat);
const side3Body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,1,.1)),
    material: planePMat
})
side3Body.position.set(-5, 1, 0)
side3Body.quaternion.setFromEuler(0,-Math.PI/2,0);
scene.add(side3);
world.addBody(side3Body);
borders.push(side3);
borderBodies.push(side3Body);

const side4Geo = new THREE.PlaneGeometry(10,2);
const side4Mat = new THREE.MeshStandardMaterial({color:0xeeeeee, side: THREE.DoubleSide});
const side4 = new THREE.Mesh(side4Geo, side4Mat);
side1.position.set(0, 2, 5);
const side4Body = new CANNON.Body({
    type: CANNON.Body.STATIC,
    shape: new CANNON.Box(new CANNON.Vec3(5,1,.1)),
    material: planePMat
})
side4Body.position.set(0, 1, -5);
world.addBody(side4Body);
scene.add(side4);
borders.push(side4);
borderBodies.push(side4Body);
//#endregion
const timestep = 1/60;

function animate(){

    for(let i =0; i < spheres.length; i++){
        spheres[i].position.copy(bodies[i].position);
        spheres[i].quaternion.copy(bodies[i].quaternion);
    }
    world.step(timestep);
    groundPlane.position.copy(planeBody.position);
    groundPlane.quaternion.copy(planeBody.quaternion);
    //#region borders
    for(let b = 0; b < borders.length; b++){
        borders[b].position.copy(borderBodies[b].position);
        borders[b].quaternion.copy(borderBodies[b].quaternion);
    }
    //#endregion
    renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

window.addEventListener('resize', function (){
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
})