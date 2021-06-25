import * as THREE from "../three/build/three.module.js";
import { Block } from "./block.js";
export class Graphics {
  constructor() {
    this.intitialize();
  }
  intitialize() {
    //this.texture = new Map();
    //this.material = new Map();
    this.texture = new THREE.TextureLoader().load("textures\\texturesheet.png");
    this.texture.magFilter = THREE.NearestFilter;
    this.texture.minFilter = THREE.NearestFilter;
    this.material = new THREE.MeshPhongMaterial({ map: this.texture });
  }
  loadTexture(what) {
    /*
    let result = this.material.get(what);
    if (result != undefined) {
      return result;
    } else {
      this.texture.set(
        what,
        new THREE.TextureLoader().load("textures\\" + Block.Textures[what])
      );
      this.texture.get(what).magFilter = THREE.NearestFilter;
      this.texture.get(what).magFilter = THREE.NearestFilter;
      this.material.set(
        what,
        new THREE.MeshPhongMaterial({ map: this.texture.get(what) })
      );
      return this.material.get(what);
    }
    */
  }
}
