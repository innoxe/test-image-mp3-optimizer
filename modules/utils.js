const mm = require("music-metadata");

exports.getMimeTypeFromBuffer = (arrayBuffer) => {
  const uint8arr = new Uint8Array(arrayBuffer);

  const len = 4;
  if (uint8arr.length >= len) {
    let signatureArr = new Array(len);
    for (let i = 0; i < len; i++)
      signatureArr[i] = new Uint8Array(arrayBuffer)[i].toString(16);
    const signature = signatureArr.join("").toUpperCase();

    switch (signature) {
      case "89504E47":
        return "image/png";
      // case "47494638":
      //   return "image/gif";
      // case "25504446":
      //   return "application/pdf";
      case "FFD8FFDB":
      case "FFD8FFE0":
        return "image/jpeg";
      // case "504B0304":
      //   return "application/zip";
      case "4944334":
        return "audio/mpeg"; // MP3 file
      default:
        return null;
    }
  }
  return null;
};

exports.getBitRateMp3 = async (bufferMp3) => {
  return mm
    .parseBuffer(bufferMp3, "audio/mpeg")
    .then((data) => {
      if (data.format && data.format.bitrate) {
        //console.log("Bitrate:", data.format.bitrate + " kbps");
        return data.format.bitrate / 1000;
      } else {
        //console.log("Bitrate not found in format information.");
        return null;
      }
    })
    .catch((error) => {
      console.error("Error parsing MP3 buffer information:", error);
      throw error;
    });
};
