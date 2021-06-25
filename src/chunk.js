import * as THREE from "../three/build/three.module.js";
import { Block, Gras, Dirt } from "./block.js";
// import * as noise from "./perlin.js"

export class Chunk {
  constructor(initPos) {
    this.initialize(initPos);
  }
  initialize(initPos) {
    this.blocks = [];

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.MeshPhongMaterial();

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.frustumCulled = false;
    this.generateMesh();
    if (initPos != undefined) {
      this.pos = initPos;
      this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    }
  }
  generateMesh() {
    //     const positions = [
    //       -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, 1.0, 1.0, 0.0,

    //       -1.0, -1.0, 0.0, 1.0, 1.0, 0.0, -1.0, 1.0, 0.0,
    //     ];
    this.amountVerts = 30000 * 3;
    this.rescaleAmount = 1;
    this.positions = new Int16Array(this.amountVerts * this.rescaleAmount);
    this.positionsSize = 0;
    this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
    this.uvs = new Float32Array((this.amountVerts / 3) * 2 * this.rescaleAmount);
    this.uvsSize = 0;
    this.geometry.setAttribute("uv", new THREE.BufferAttribute(this.uvs, 2));
  }
  addFace(direction, p, blocc) {
    let verts = [];
    switch (direction) {
      case Block.Direction.backwards:
        verts = [1, 1, 1, -1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, 1, -1, 1];
        break;
      case Block.Direction.forward:
        verts = [-1, 1, -1, 1, 1, -1, 1, -1, -1, -1, 1, -1, 1, -1, -1, -1, -1, -1];
        break;
      case Block.Direction.up:
        verts = [-1, 1, 1, 1, 1, 1, 1, 1, -1, -1, 1, 1, 1, 1, -1, -1, 1, -1];
        break;
      case Block.Direction.down:
        verts = [1, -1, -1, 1, -1, 1, -1, -1, 1, 1, -1, -1, -1, -1, 1, -1, -1, -1];
        break;

      case Block.Direction.left:
        verts = [-1, 1, 1, -1, 1, -1, -1, -1, -1, -1, 1, 1, -1, -1, -1, -1, -1, 1];
        break;

      case Block.Direction.right:
        verts = [1, 1, -1, 1, 1, 1, 1, -1, 1, 1, 1, -1, 1, -1, 1, 1, -1, -1];
        break;
    }
    let numState = 0;
    let absoluteVerts = verts.map((elem) => {
      numState++;
      if (numState == 4) {
        numState = 1;
      }
      switch (numState) {
        case 1:
          return elem + p.x * 2;
        case 2:
          return elem + p.y * 2;
        case 3:
          return elem + p.z * 2;

        default:
          return elem;
      }
    });

    for (let i = 0; i < absoluteVerts.length; i++) {
      this.potentialRescaleGeometryBuffer();
      this.positions[this.positionsSize] = absoluteVerts[i];
      this.positionsSize++;
    }
    let calc = 16 / 256;
    let bigger = 1;
    let mult = calc;
    let pos;
    switch (direction) {
      case Block.Direction.up:
        pos = new THREE.Vector2(calc * blocc.uvPosUp.x, calc * blocc.uvPosUp.y);
        break;
      case Block.Direction.down:
        pos = new THREE.Vector2(calc * blocc.uvPosDown.x, calc * blocc.uvPosDown.y);
        break;
      default:
        pos = new THREE.Vector2(calc * blocc.uvPosSide.x, calc * blocc.uvPosSide.y);
        break;
    }

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= mult;
    this.uvs[this.uvsSize] += pos.x;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 1;
    this.uvs[this.uvsSize] += pos.y;
    //this.uvs[this.uvsSize] *= mult;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 0;
    this.uvs[this.uvsSize] += pos.x;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 1;
    this.uvs[this.uvsSize] += pos.y;
    // this.uvs[this.uvsSize] *= mult;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 0;
    this.uvs[this.uvsSize] += pos.x;
    this.uvsSize++;

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= 1 - mult;
    this.uvs[this.uvsSize] += pos.y;

    this.uvsSize++;

    //other face

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= mult;
    this.uvs[this.uvsSize] += pos.x;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 1;
    this.uvs[this.uvsSize] += pos.y;
    //this.uvs[this.uvsSize] *= 1 - mult;
    this.uvsSize++;

    this.uvs[this.uvsSize] = 0;
    this.uvs[this.uvsSize] += pos.x;
    //this.uvs[this.uvsSize] *= mult;
    this.uvsSize++;

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= 1 - mult;
    this.uvs[this.uvsSize] += pos.y;
    this.uvsSize++;

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= mult;
    this.uvs[this.uvsSize] += pos.x;
    this.uvsSize++;

    this.uvs[this.uvsSize] = bigger;
    this.uvs[this.uvsSize] *= 1 - mult;
    this.uvs[this.uvsSize] += pos.y;
    this.uvsSize++;

    // for (let i = 0; i < ((absoluteVerts.length / 3) * 2); i++) {
    //   this.uvs[this.uvsSize] = Math.random(1);
    //   this.uvsSize++;
    // }
  }

  removeFace(direction, p) {
    for (let i = 0; i < 100; i++) {
      console.log(this.uvs[i]);
    }
  }
  /*
  removeEdges(chunk, direction){
    if(direction == Block.Direction.left){
      for()
    }
  }
  */

  potentialRescaleGeometryBuffer() {
    if (this.positionsSize >= this.amountVerts * this.rescaleAmount - 2) {
      console.log("Error tried to go over max verts size" + this.amountVerts * this.rescaleAmount);
      let tempPos = this.positions;
      let tempUv = this.uvs;
      this.positions = new Int16Array(this.amountVerts * (this.rescaleAmount + 1));
      this.uvs = new Float32Array((this.amountVerts / 3) * 2 * (this.rescaleAmount + 1));
      for (let i = 0; i < this.positionsSize; i++) {
        this.positions[i] = tempPos[i];
      }
      for (let i = 0; i < this.uvsSize; i++) {
        this.uvs[i] = tempUv[i];
      }
      this.rescaleAmount++;
      this.scene.remove(this.mesh);
      this.geometry = new THREE.BufferGeometry();
      this.geometry.setAttribute("position", new THREE.BufferAttribute(this.positions, 3));
      this.geometry.setAttribute("uv", new THREE.BufferAttribute(this.uvs, 2));
      this.geometry.computeVertexNormals();
      this.geometry.computeBoundingBox();
      this.geometry.computeBoundingSphere();
      this.geometry.attributes.position.needsUpdate = true;
      this.geometry.attributes.uv.needsUpdate = true;

      this.geometry.setDrawRange(0, this.positionsSize);
      this.updateGeometry();
      this.mesh = new THREE.Mesh(this.geometry, this.material);
      if (this.pos != undefined) {
        this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
      }
      this.mesh.frustumCulled = false;
      this.scene.add(this.mesh);
    }
  }

  generateChunk(size) {
    this.resetWorld();

    this.blocks = [];
    let positions = [];
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        //console.log(x+this.pos.x);
        let pos = new THREE.Vector3(x, Math.floor(5 * (1 + noise.simplex2((x + this.pos.x / 2) / 50, (y + this.pos.z / 2) / 50))), y);
        positions.push(pos);
        this.blocks.push(new Gras(pos));
      }
    }
    let curSize = positions.length;
    let minX = 10000;
    let minY = 10000;
    let maxX = -10000;
    let maxY = -10000;
    for (let i = 0; i < curSize; i++) {
      for (let j = positions[i].y; j > 0; j--) {
        let pos = new THREE.Vector3(positions[i].x, j - 1, positions[i].z);
        positions.push(pos);
        this.blocks.push(new Dirt(pos));
        if (positions[i].x < minX) {
          minX = positions[i].x;
        }
        if (positions[i].x > maxX) {
          maxX = positions[i].x;
        }
        if (positions[i].z < maxY) {
          maxY = positions[i].z;
        }
        if (positions[i].z > minY) {
          minY = positions[i].z;
        }
      }
    }
    this.generateFromPositions(positions, minX, minY, maxX, maxY);
    let uvs = this.geometry.attributes.uv.array;

    for (var i = 0, len = uvs.length; i < len; i++) {
      //uvs[i] *= 2;
    }
    //this.mesh.attributes.uv.array = uvs;
    this.updateGeometry();
  }

  addBlock(offset) {
    this.addFace(Block.Direction.backwards, offset);
    this.addFace(Block.Direction.forward, offset);
    this.addFace(Block.Direction.up, offset);
    this.addFace(Block.Direction.down, offset);
    this.addFace(Block.Direction.left, offset);
    this.addFace(Block.Direction.right, offset);
    this.updateGeometry();
  }

  generateFromPositions(arr, minX, minY, maxX, maxY) {
    let hashArr = new Map();
    for (let i = 0; i < arr.length; i++) {
      hashArr.set(Block.VectorToString(arr[i]), true);
      //TODO FIX CUlling
      // if(arr[i].x == minX){hashArr.set(Block.VectorToString(new THREE.Vector3(minX-1,arr[i].y, arr[i].z )), true); }
      // if(arr[i].x == maxX){hashArr.set(Block.VectorToString(new THREE.Vector3(maxX+1,arr[i].y, arr[i].z )), true); }
      //  if(arr[i].z == minY){hashArr.set(Block.VectorToString(new THREE.Vector3(arr[i].x,arr[i].y, minY-1 )), true); }
      //  if(arr[i].z == maxY){hashArr.set(Block.VectorToString(new THREE.Vector3(arr[i].x,arr[i].y, maxY+1 )), true); }
    }

    for (let i = 0; i < arr.length; i++) {
      let vector = arr[i];
      let blocc = this.blocks[i];
      //       let leftVector = new THREE.Vector3(arr[i].x - 1, arr[i].y, arr[i].z);
      //       let rightVector = new THREE.Vector3(arr[i].x + 1, arr[i].y, arr[i].z);
      //       let forwardVector = new THREE.Vector3(arr[i].x, arr[i].y, arr[i].z - 1);
      //       let backwardsVector = new THREE.Vector3(arr[i].x, arr[i].y, arr[i].z + 1);
      //       let upVector = new THREE.Vector3(arr[i].x, arr[i].y + 1, arr[i].z);
      //       let downVector = new THREE.Vector3(arr[i].x, arr[i].y - 1, arr[i].z);
      let leftVector = arr[i].x - 1 + ":" + arr[i].y + ":" + arr[i].z;
      let rightVector = arr[i].x + 1 + ":" + arr[i].y + ":" + arr[i].z;
      let forwardVector = arr[i].x + ":" + arr[i].y + ":" + (arr[i].z - 1);
      let backwardsVector = arr[i].x + ":" + arr[i].y + ":" + (arr[i].z + 1);
      let upVector = arr[i].x + ":" + (arr[i].y + 1) + ":" + arr[i].z;
      let downVector = arr[i].x + ":" + (arr[i].y - 1) + ":" + arr[i].z;

      //would only render boxes with at least one box next to it to test the inside face culling
      //       if (
      //         hashArr.get(leftVector) == undefined &&
      //         hashArr.get(rightVector) == undefined &&
      //         hashArr.get(forwardVector) == undefined &&
      //         hashArr.get(backwardsVector) == undefined &&
      //         hashArr.get(upVector) == undefined &&
      //         hashArr.get(downVector) == undefined
      //       ) {
      //         continue;
      //       }
      if (hashArr.get(leftVector) == undefined) {
        this.addFace(Block.Direction.left, vector, blocc);
      }
      if (hashArr.get(rightVector) == undefined) {
        this.addFace(Block.Direction.right, vector, blocc);
      }
      if (hashArr.get(forwardVector) == undefined) {
        this.addFace(Block.Direction.forward, vector, blocc);
      }
      if (hashArr.get(backwardsVector) == undefined) {
        this.addFace(Block.Direction.backwards, vector, blocc);
      }
      if (hashArr.get(upVector) == undefined) {
        this.addFace(Block.Direction.up, vector, blocc);
      }
      if (hashArr.get(downVector) == undefined) {
        this.addFace(Block.Direction.down, vector, blocc);
      }
    }
    this.updateGeometry();
    if (this.mesh != undefined) this.scene.remove(this.mesh);
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    if (this.pos != undefined) {
      this.mesh.position.set(this.pos.x, this.pos.y, this.pos.z);
    }
    this.scene.add(this.mesh);
    this.updateGeometry();
  }

  resetWorld() {
    for (let i = 0; i < this.positionsSize; i++) {
      this.positions[i] = 0;
    }
    this.positionsSize = 0;
    this.updateGeometry();
  }

  updateGeometry() {
    this.geometry.computeVertexNormals();
    this.geometry.attributes.position.needsUpdate = true;
    this.geometry.attributes.uv.needsUpdate = true;

    this.geometry.setDrawRange(0, this.positionsSize);
  }
  loadMaterial(newMaterial) {
    // this.loadedMaterial = true;
    this.material = newMaterial;
    this.mesh.material = this.material;
  }

  addToScene(scene) {
    this.scene = scene;
    scene.add(this.mesh);
  }
  setPosition(pos) {
    this.pos = pos;
    this.mesh.position = pos;
  }
  getGeometry() {
    return this.geometry;
  }
  getMesh() {
    return this.mesh + 1;
  }
}
