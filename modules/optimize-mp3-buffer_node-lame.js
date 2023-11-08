const Lame = require("node-lame").Lame;
const tmp = require("tmp");
const fs = require("fs");
const { getBitRateMp3 } = require("./utils");

const nodeLameOptimizeMp3Buffer = async (inputBuffer, bitrateTarget = 192) => {
  if (!Buffer.isBuffer(inputBuffer)) {
    throw new Error("The input parameter must be a buffer.");
  }
  const bitrate = await getBitRateMp3(inputBuffer);
  if (bitrate && bitrate < bitrateTarget) return inputBuffer;
  return new Promise((resolve, reject) => {
    // Create temporary file
    tmp.file({ postfix: ".mp3" }, (err, tmpPath, fd, cleanupCallback) => {
      if (err) {
        reject(err);
        return;
      }

      // Write buffer content in the temporary file
      fs.write(fd, inputBuffer, 0, inputBuffer.length, null, async (err) => {
        if (err) {
          reject(err);
          cleanupCallback();
          return;
        }
        // Use Node-lame to process temporary file
        const encoder = new Lame({
          output: "buffer",
          bitrate: bitrateTarget,
        }).setFile(tmpPath);

        encoder
          .encode()
          .then(() => {
            // Encoding finished and resolve buffer
            const buffer = encoder.getBuffer();
            resolve(buffer);
          })
          .catch((error) => {
            cleanupCallback();
            reject(error);
          });
      });
    });
  });

  // THIS DEFAUT CODE DOESN'T WORK
  /*
  return new Promise((resolve, reject) => {
    const encoder = new Lame({
      output: "buffer",
      bitrate: 56,
    }).setBuffer(inputBuffer);

    encoder
      .encode()
      .then(() => {
        // Encoding finished
        const buffer = encoder.getBuffer();
        resolve(buffer);
      })
      .catch((error) => {
        // Something went wrong
        console.log("Error to encode mp3 : ", error);
      });
  });
*/
};

module.exports = nodeLameOptimizeMp3Buffer;
