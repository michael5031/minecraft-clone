import * as THREE from "../three/build/three.module.js";
import { Block } from "./block.js";
export class ControlHandler {
  constructor(worldgenerator, camera) {
    this.initialize(worldgenerator, camera);
  }
  initialize(worldgenerator, camera) {
    this.upper = [];
    this.upper.push(worldgenerator);
    this.upper.push(camera);
    document.addEventListener("keydown", (e) => {
      this.onKeyPress(e);
    });
    this.cur = 0;
  }

  onKeyPress(e) {
    if (e.repeat != undefined) {
      if (e.repeat == true) return;
    }

    //this.cur++;

    //space
    if (e.keyCode == 70) {
      let chunk = this.upper[0].getChunkAtPosition(this.upper[1].position);
      for (let i = 0; i < chunk.positionsSize; i++) {
        chunk.positions[i] = 0;
      }
      chunk.updateGeometry();
    }

    if (e.keyCode == 32) {
      let chunk = this.upper[0].getChunkAtPosition(this.upper[1].position);
      //deletes first found gras blocks face
      // let firstGrasBlock = chunk.findBlockByName("Gras");
      // chunk.removeFace(Block.Direction.forward, firstGrasBlock.position);
      // chunk.removeFace(Block.Direction.up, firstGrasBlock.position);
      // chunk.updateGeometry();
      //chunk.addFace(Block.Direction.up, firstGrasBlock.position)
      console.log(chunk.surroundingChunks);
    }
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
