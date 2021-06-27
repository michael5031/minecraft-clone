import * as THREE from "../three/build/three.module.js";
import { Block, Gras, Dirt } from "./block.js";
// import * as noise from "./perlin.js"

export class Chunk {
  constructor(initPos, chunkSize) {
    this.initialize(initPos, chunkSize);
  }
  initialize(initPos, chunkSize) {
    this.chunkSize = chunkSize;
    this.surroundingChunks = {};

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
    this.amountVerts = 20000 * 3;
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
    // if (direction != Block.Direction.up) {
    //   return;
    // }
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
    let blockVertsUp = Block.DirectionalFaces[direction];
    let numState = 0;
    let calcUp = blockVertsUp.map((elem) => {
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
    //console.log(calcUp);
    let foundId = -1;

    for (let i = 0; i < this.positionsSize; i += 18) {
      let split = this.positions.slice(i, i + 18);

      let found = false;
      for (let j = 0; j < split.length; j++) {
        if (split[j] != calcUp[j]) {
          found = true;
          break;
        }
      }

      if (!found) {
        foundId = i;
        for (let j = 0; j < split.length; j++) {
          this.positions[foundId + j] = 0;
        }
        break;
      }
    }
    if (foundId != -1) {
    }

    // for (let i = 0; i < this.blocks.length; i++) {
    //   if (this.blocks[i].position == p) {
    //     this.blocks.splice(i, 1);
    //   }
    // }

    // this.updateGeometry();
  }

  removeEdges(direction) {
    let nextChunk = this.surroundingChunks[direction];
    if (nextChunk == undefined) {
      return undefined;
    }
    let actuallyDeleteStuff = (x, y, z, i) => {
      let worldVector = this.toWorldPosition(this.blocks[i].position);
      let added = new THREE.Vector3(worldVector.x + x, worldVector.y + y, worldVector.z + z);
      let localAdded = nextChunk.toLocalPosition(added);
      if (nextChunk.getBlockByPosition(localAdded) != undefined) {
        this.removeFace(direction, this.blocks[i].position);
      }
    };

    for (let i = 0; i < this.blocks.length; i++) {
      switch (direction) {
        case Block.Direction.left:
          if (this.blocks[i].position.x == 0) {
            actuallyDeleteStuff(-1, 0, 0, i);
          }
          break;
        case Block.Direction.right:
          if (this.blocks[i].position.x == this.chunkSize - 1) {
            actuallyDeleteStuff(1, 0, 0, i);
          }
          break;

        case Block.Direction.forward:
          if (this.blocks[i].position.z == 0) {
            actuallyDeleteStuff(0, 0, -1, i);
          }
          break;
        case Block.Direction.backwards:
          if (this.blocks[i].position.z == this.chunkSize - 1) {
            actuallyDeleteStuff(0, 0, 1, i);
          }
          break;
      }
    }
    this.updateGeometry();
  }

  toLocalPosition(position) {
    return new THREE.Vector3(position.x - this.mesh.position.x / 2, position.y - this.mesh.position.y / 2, position.z - this.mesh.position.z / 2);
  }
  toWorldPosition(position) {
    return new THREE.Vector3(this.mesh.position.x / 2 + position.x, this.mesh.position.y / 2 + position.y, this.mesh.position.z / 2 + position.z);
  }

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

  generateChunk() {
    this.resetWorld();

    this.blocks = [];
    let positions = [];
    for (let x = 0; x < this.chunkSize; x++) {
      for (let y = 0; y < this.chunkSize; y++) {
        //console.log(x+this.pos.x);
        //let pos = new THREE.Vector3(x, Math.floor(10 * (1 + noise.simplex2((x + this.pos.x / 2) / 50, (y + this.pos.z / 2) / 50))), y);
        let pos = new THREE.Vector3(x, Math.floor(10), y);
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

  getBlockByPosition(position) {
    //console.log("first pos" + position.x + " and " + position.y + " and " + position.z);
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].position.x == position.x) {
        //console.log(this.blocks[i].position);
      }
      if (this.blocks[i].position.x == position.x && this.blocks[i].position.y == position.y && this.blocks[i].position.z == position.z) {
        return this.blocks[i];
      }
    }
    return undefined;
  }

  getMeshVerticiesByBlock(block, direction) {}

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

  findBlockByName(name) {
    for (let i = 0; i < this.blocks.length; i++) {
      if (this.blocks[i].name == name) {
        return this.blocks[i];
      }
    }
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
