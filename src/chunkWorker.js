import { Chunk } from "./chunk.js";
onmessage = function (e) {
  let copied = e.data;
  copied.generateChunk();
  postMessage(copied);
};
