import * as THREE from "../three/build/three.module.js";
import { OrbitControls } from "../three/examples/jsm/controls/OrbitControls.js";

import { Chunk } from "./chunk.js";
import { ControlHandler } from "./controlhandler.js";
import { Graphics } from "./graphics.js";
import { Worldgenerator } from "./worldgenerator.js";
export class Game {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 4000);
    this.camera.position.z = 5;

    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.update();

    this.light = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    this.scene.add(this.light);

    //Load texture handler
    this.graphics = new Graphics();

    // let myNewChunk = new Chunk(new THREE.Vector3(0,0,0));
    // 			myNewChunk.addToScene(this.scene);
    // 			myNewChunk.generateChunk(100);

    noise.seed(Math.random(1));

    this.world = new Worldgenerator(this.graphics.material, this.scene);
    // this.world.loadChunksAroundPosition(new THREE.Vector3(0,0,0));

    // this.world1 = new Chunk(new THREE.Vector3(0,0,0));
    // this.world1.loadMaterial(this.graphics.material);
    // this.world1.addToScene(this.scene);
    // this.world1.generateChunk(50);

    // this.world1 = new Chunk();
    // this.world1.loadMaterial(this.graphics.material);
    // this.world1.addToScene(this.scene);

    this.controlhandler = new ControlHandler(this.world, this.camera);

    window.addEventListener("resize", () => this.onWindowResize(), false);
    this.render();
  }
  onWindowResize() {
    if (this.camera == undefined || this.renderer == undefined) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  render() {
    requestAnimationFrame(() => this.render());
    this.renderer.render(this.scene, this.camera);
    // console.log(Math.floor(this.camera.position.x / 16) * 16);
    this.world.loadChunksAroundPosition(new THREE.Vector3(Math.floor(this.camera.position.x / 16) * 16, 0, Math.floor(this.camera.position.z / 16) * 16));
  }
}
