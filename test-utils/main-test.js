const optimizeImageBuffer = require("../modules/optimize-image-buffer");
const nodeLameOptimizeMp3Buffer = require("../modules/optimize-mp3-buffer_node-lame");
const ffmpegOptimizeMp3Buffer = require("../modules/optimize-mp3-buffer-ffmpeg");
const {
  displayRecapData,
  retrieveBufferFromFirebaseStorage: getBufferFromFirebase,
} = require("./index");
const { getMimeTypeFromBuffer } = require("../modules/utils");

// Main function that orchestrates the optimization test process
const mainTest = async (filePath, useFFMPEG = 1) => {
  try {
    // Get buffer from file in firebase storage
    const originalBuffer = await getBufferFromFirebase(filePath);
    // Start test of image and mp3 modules
    const bufferFile = await testModules(originalBuffer, useFFMPEG);

    // Display log of test
    if (bufferFile) {
      await displayRecapData(filePath, originalBuffer, bufferFile, useFFMPEG);
    } else {
      console.log("No optimization performed.");
    }
  } catch (error) {
    console.error("General error:", error);
  }
};

// Asynchronously test various optimization image and two mp3 modules on the original buffer
const testModules = async (originalBuffer, useFFMPEG) => {
  const typeBuffer = getMimeTypeFromBuffer(originalBuffer);

  if (typeBuffer === "image/png" || typeBuffer === "image/jpeg") {
    // Optimize the buffer using an image optimization module
    return await optimizeImageBuffer(originalBuffer);
  }

  if (typeBuffer === "audio/mpeg") {
    if (useFFMPEG) {
      // Optimize the MP3 buffer using FFMPEG-based module
      return await ffmpegOptimizeMp3Buffer(originalBuffer)
        .then((outputBuffer) => outputBuffer)
        .catch((error) => {
          console.error("Error while changing bitrate using FFMPEG:", error);
          return null;
        });
    } else {
      // Optimize the MP3 buffer using node-lame module
      return await nodeLameOptimizeMp3Buffer(originalBuffer);
    }
  }

  return null;
};

module.exports = mainTest;
