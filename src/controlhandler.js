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

    if (e.keyCode != 32) {
      return;
    }

    // for (let i = 0; i < 10; i++) {
    //   for (let j = 0; j < 100; j++) {
    //     for (let k = 0; k < 100; k++) {
    //       pos.push(new THREE.Vector3(i, k, j));
    //     }
    //   }
    // }
    this.upper[0].getChunkAtPosition(this.upper[1].position).removeFace(Block.Direction.down, new THREE.Vector3(0, 0, 0));
    //this.worldgenerator[0].resetWorld();
    //this.worldgenerator[0].generateFromPositions(pos);
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
