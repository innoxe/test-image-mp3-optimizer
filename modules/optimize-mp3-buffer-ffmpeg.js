const tmp = require("tmp");
const fs = require("fs");
const { getBitRateMp3 } = require("./utils");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const ffmpegOptimizeMp3Buffer = async (inputBuffer, newBitrate = 16) => {
  if (!Buffer.isBuffer(inputBuffer)) {
    throw new Error("The input parameter must be a buffer.");
  }
  const bitrate = await getBitRateMp3(inputBuffer);
  if (bitrate && bitrate < newBitrate) return inputBuffer;

  try {
    const inputFile = await new Promise((resolve, reject) => {
      tmp.file({ postfix: ".mp3" }, (err, tmpPath, fd, cleanupCallback) => {
        if (err) reject(err);
        resolve({ path: tmpPath, cleanup: cleanupCallback });
      });
    });

    const outputPath = await new Promise((resolve, reject) => {
      tmp.file(
        { postfix: ".mp3" },
        (err, outputPath, outputFd, outputCleanupCallback) => {
          //if (err) reject(err);
          if (err) {
            reject(err);
            inputFile.cleanup();
          }
          resolve({ path: outputPath, cleanup: outputCleanupCallback });
        }
      );
    });

    fs.writeFile(inputFile.path, inputBuffer, (err) => {
      if (err) {
        reject(err);
        inputFile.cleanup();
        outputPath.cleanup();
        return;
      }
    });

    return new Promise((resolve, reject) => {
      ffmpeg()
        .input(inputFile.path)
        .output(outputPath.path)
        .audioBitrate(`${newBitrate}k`)
        .toFormat("mp3")
        .on("end", () => {
          const resultBuffer = fs.readFileSync(outputPath.path);
          inputFile.cleanup();
          outputPath.cleanup();
          resolve(resultBuffer);
        })
        .on("error", (error) => {
          inputFile.removeCallback();
          reject(error);
        })
        .run();
    });
  } catch (error) {
    throw error;
  }
};

module.exports = ffmpegOptimizeMp3Buffer;
