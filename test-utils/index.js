const FirebaseStorageUtils = require("../firebase-utils");
const { getMimeTypeFromBuffer, getBitRateMp3 } = require("../modules/utils");

// Asynchronously retrieve the buffer from Firebase storage based on the provided file path
exports.retrieveBufferFromFirebaseStorage = async (filePath) => {
  const firebaseStorage = new FirebaseStorageUtils(filePath);
  // Obtain metadata information (if needed) and log it
  const metadata = await firebaseStorage.getMetaData();
  console.log("Metadata obtained:", metadata);
  // Retrieve the original buffer from the storage
  const originalBuffer = await firebaseStorage.getBuffer();
  return originalBuffer;
};

exports.displayRecapData = async (filePath, buffer, bufferFile, useFFMPEG) => {
  const MODULE_USED = ["node-lame", "fluent-ffmpeg"];
  const getTypeFile = getMimeTypeFromBuffer(buffer);
  const kbitsOriginalBuffer = await getBitRateMp3(buffer);
  const kbitsOptimizedBuffer = await getBitRateMp3(bufferFile);

  console.log("=".repeat(50));
  console.log(`  Recap Optimization of ${filePath}`);
  console.log("=".repeat(50));
  console.log(`Type: ${getTypeFile}`);
  if (getTypeFile === "audio/mpeg") {
    console.log(`Module used: ${MODULE_USED[useFFMPEG]}`);
    console.log(
      `Original size: ${formatSize(
        buffer.length
      )} KB - ${kbitsOriginalBuffer} kbps`
    );
    console.log(
      `Optimized size: ${formatSize(
        bufferFile.length
      )} KB - ${kbitsOptimizedBuffer} kbps`
    );
  } else {
    console.log(`Original size: ${formatSize(buffer.length)} KB`);
    console.log(`Optimized size: ${formatSize(bufferFile.length)} KB`);
  }

  console.log("=".repeat(50));
};

const formatSize = (sizeInBytes) => {
  // Function to format size in kilobytes (KB)
  const sizeInKB = sizeInBytes / 1024;
  return sizeInKB.toFixed(2); // Shows only two digitsdecimali
};
