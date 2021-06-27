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
    this.chunkAmount = 4 * 4;
  }
  loadChunksAroundPosition(pos) {
    let totalSizeHalf = (this.chunkSize * Math.sqrt(this.chunkAmount)) / 2;
    let calculatedPosX = 1 * (Math.floor(pos.x / this.chunkSize) * this.chunkSize);
    let calculatedPosY = 1 * (Math.floor(pos.z / this.chunkSize) * this.chunkSize);
    for (let x = 0; x < Math.floor(Math.sqrt(this.chunkAmount)); x++) {
      for (let y = 0; y < Math.floor(Math.sqrt(this.chunkAmount)); y++) {
        let vec = new THREE.Vector3(calculatedPosX + x * this.chunkSize, 0, calculatedPosY + y * this.chunkSize);

        let stringKey = Block.VectorToString(vec);

        if (this.chunks.get(stringKey) != undefined) {
        } else {
          //TODO add worker world loading
          if (window.Worker) {
            let newChunk = new Chunk(vec, this.chunkSize / 2);
            newChunk.loadMaterial(this.material.material);
            newChunk.addToScene(this.scene.scene);
            let worker = new Worker("src/chunkWorker.js", { type: "module" });
            worker.postMessage(newChunk);

            worker.onmessage = (e) => {
              this.chunks.set(stringKey, e.data);
            };
          } else {
            this.chunks.set(stringKey, new Chunk(vec, this.chunkSize / 2));
            this.chunks.get(stringKey).loadMaterial(this.material.material);
            this.chunks.get(stringKey).addToScene(this.scene.scene);
            this.chunks.get(stringKey).generateChunk();

            let addSurroundingChunks = (x, y, z, dir1, dir2) => {
              let foundChunk = this.chunks.get(Block.VectorToString(new THREE.Vector3(vec.x + x, vec.y + y, vec.z + z)));
              if (foundChunk != undefined) {
                let curChunk = this.chunks.get(stringKey);

                if (curChunk.surroundingChunks[dir1] == undefined) {
                  curChunk.surroundingChunks[dir1] = foundChunk;
                  curChunk.removeEdges(dir1);
                }
                if (foundChunk.surroundingChunks[dir2] == undefined) {
                  foundChunk.surroundingChunks[dir2] = curChunk;
                  foundChunk.removeEdges(dir2);
                }
              }
            };
            //removes edges from chunks but takes longer to generate
            addSurroundingChunks(-this.chunkSize, 0, 0, Block.Direction.left, Block.Direction.right);
            addSurroundingChunks(this.chunkSize, 0, 0, Block.Direction.right, Block.Direction.left);
            addSurroundingChunks(0, 0, this.chunkSize, Block.Direction.backwards, Block.Direction.forward);
            addSurroundingChunks(0, 0, -this.chunkSize, Block.Direction.forward, Block.Direction.backwards);
          }
        }
      }
    }
  }
  getChunkAtPosition(pos) {
    let calcPos = new THREE.Vector3(Math.floor(pos.x / this.chunkSize) * this.chunkSize, 0, Math.floor(pos.z / this.chunkSize) * this.chunkSize);
    return this.chunks.get(Block.VectorToString(calcPos));
  }
}
