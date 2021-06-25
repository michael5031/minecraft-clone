import * as THREE from "../three/build/three.module.js";
import { Block } from "./block.js";
import { Chunk } from "./chunk.js";
export class Worldgenerator {
  constructor(material, scene) {
    this.initialize(material, scene);
  }
  initialize(material, scene) {
    this.material = { material: material };
    this.scene = { scene: scene };
    this.chunks = new Map();
    this.chunkSize = 32;
    // this.chunkAmount = 9;
    this.chunkAmount = 9;
  }
  loadChunksAroundPosition(pos) {
    let totalSizeHalf = (this.chunkSize * this.chunkAmount) / 2;
    let calculatedPosX = 1 * (Math.floor(pos.x / this.chunkSize) * this.chunkSize);
    let calculatedPosY = 1 * (Math.floor(pos.z / this.chunkSize) * this.chunkSize);
    for (let x = 0; x < Math.sqrt(this.chunkAmount); x++) {
      for (let y = 0; y < Math.sqrt(this.chunkAmount); y++) {
        let vec = new THREE.Vector3(calculatedPosX + x * this.chunkSize * 2, 0, calculatedPosY + y * this.chunkSize * 2);
        let stringKey = Block.VectorToString(vec);

        if (this.chunks.get(stringKey)) {
        } else {
          //TODO add worker world loading
          //if (window.Worker) {
          // let worldGeneratorSlave = new Worker("./chunkWorker.js");
          // worldGeneratorSlave.postMessage({
          //   material: this.material.material,
          //   scene: this.scene.scene,
          //   chunkSize: this.chunkSize,
          //    vec: vec,
          //  });
          //} else {
          this.chunks.set(stringKey, new Chunk(vec));
          this.chunks.get(stringKey).loadMaterial(this.material.material);
          this.chunks.get(stringKey).addToScene(this.scene.scene);
          this.chunks.get(stringKey).generateChunk(this.chunkSize);
          // if (this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x - this.chunkSize, vec.y, vec.z))) != undefined) {
          //   this.chunks.get(stringKey).removeEdges(this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x - this.chunkSize, vec.y, vec.z))), Block.Direction.left);
          // }
          // if (this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x + this.chunkSize, vec.y, vec.z))) != undefined) {
          //   this.chunks.get(stringKey).removeEdges(this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x + this.chunkSize, vec.y, vec.z))), Block.Direction.right);
          // }
          // if (this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x, vec.y, vec.z - this.chunkSize))) != undefined) {
          //   this.chunks.get(stringKey).removeEdges(this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x, vec.y, vec.z - this.chunkSize))), Block.Direction.forward);
          // }
          // if (this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x, vec.y, vec.z + this.chunkSize))) != undefined) {
          //   this.chunks.get(stringKey).removeEdges(this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x, vec.y, vec.z + this.chunkSize))), Block.Direction.backwards);
          // }

          //}
        }
      }
    }
  }
  getChunkAtPosition(pos) {
    let calcPos = new THREE.Vector3(Math.floor(pos.x / this.chunkSize) * this.chunkSize, Math.floor(pos.y / this.chunkSize) * this.chunkSize, Math.floor(pos.z / this.chunkSize) * this.chunkSize);
    return this.chunks.get(Block.VectorToString(calcPos));
  }
}
