const sharp = require("sharp");
const { getMimeTypeFromBuffer } = require("./utils");

const optimizeImageBuffer = async (
  inputBuffer,
  fileType = null,
  size = null
) => {
  if (!Buffer.isBuffer(inputBuffer)) {
    throw new Error("The input parameter must be a buffer.");
  }

  if (!fileType) fileType = getMimeTypeFromBuffer(inputBuffer);
  /** Check file type */
  if (fileType !== "image/png" && fileType !== "image/jpeg") {
    throw new Error('The file type must be "image/png", "image/jpeg".');
  }

  const sizeLimit = 300 * 1024; // 300 KB

  if (!size) size = inputBuffer.length;

  /** Returns the optimized buffer if the size is within the limit*/
  if (size >= sizeLimit) {
    // Optimize the image to 70% quality
    const optmizedBuffer = await sharp(inputBuffer)
      .jpeg({ quality: 70 })
      .toBuffer();
    console.log("The function optimizeImageBuffer says 'file optimized'");
    return optmizedBuffer;
  } else {
    console.log("The file does not require optimization.");
    return inputBuffer;
  }
};

module.exports = optimizeImageBuffer;
