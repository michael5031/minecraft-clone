import * as THREE from "../three/build/three.module.js";

export class Block {
  constructor(props) {
    this.name = "undefined lol";
    if (props.vec) {
      this.position = props.vec;
    }
    if (props.uvPos) {
      this.uvPosUp = props.uvPos;
      this.uvPosSide = props.uvPos;
      this.uvPosDown = props.uvPos;
    } else if (props.uvPosUp && props.uvPosSide && props.uvPosDown) {
      this.uvPosUp = props.uvPosUp;
      this.uvPosSide = props.uvPosSide;
      this.uvPosDown = props.uvPosDown;
    }
  }

  static Direction = Object.freeze({
    up: 0,
    down: 1,
    left: 2,
    right: 3,
    forward: 4,
    backwards: 5,
  });

  static VectorToString(vec) {
    return vec.x + ":" + vec.y + ":" + vec.z;
  }

  static DirectionalFaces = Object.freeze({
    0: [-1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1],
    1: [1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1],
    2: [-1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, 1],
    3: [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1],
    4: [-1, 1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1],
    5: [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1],
  });

  /*
  static Textures = Object.freeze({
    0: "gras.png",
    1: "grasTop.png",
    2: "dirt.png",
  });
  */
}

export class Gras extends Block {
  constructor(vec) {
    super({
      vec: vec,
      uvPosUp: new THREE.Vector2(1, 0),
      uvPosSide: new THREE.Vector2(0, 0),
      uvPosDown: new THREE.Vector2(2, 0),
    });
    this.name = "Gras";
  }
}

export class Dirt extends Block {
  constructor(vec) {
    super({ vec: vec, uvPos: new THREE.Vector2(2, 0) });
    this.name = "Dirt";
  }
}
