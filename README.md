
# Optimize Image & MP3

## Description

This project offers modules for optimizing JPG/PNG images and MP3 files using Node.js libraries. The project is divided into three main parts:

1. `firebase-utils`: Contains modules for connecting to Firebase Storage.
2. `test-utils`: Contains modules for handling tests.
3. `modules`: Contains the modules that will be used in production, including:
   - `optimize-image-buffer.js`: Module for optimizing JPG/PNG images using the `sharp` library.
   - `optimize-mp3-buffer_node-lame.js`: Module for optimizing MP3 files using the `node-lame` library.
   - `optimize-mp3-buffer-ffmpeg.js`: Module for optimizing MP3 files using the `fluent-ffmpeg` library.

## Usage

```javascript
const mainTest = require("./test-utils/main-test");

// Define the file path to the image or MP3 file in Firebase Storage
const imageFilePath = "images/5550970_2880645.jpg";
const mp3FilePath =
  "mp3/audio_www.everyeye.it_articoli-speciale-alan-wake-riassunto-imperdibile-storia-pronti-61338-html.mp3";

// Call the main function, specifying the module to use for MP3 optimization (1 for FFMPEG, 0 for node-lame)
mainTest(mp3FilePath, 1); // Test MP3 optimization using FFMPEG
//mainTest(imageFilePath); // Test image optimization
```


## Installation of Libraries

Make sure to have the following dependencies installed on your server:

- [`node-lame`](https://www.npmjs.com/package/node-lame): A library for optimizing MP3 files.
- [`fluent-ffmpeg`](https://www.npmjs.com/package/fluent-ffmpeg): A wrapper for the FFMPEG library used for MP3 optimization.
- [`sharp`](https://www.npmjs.com/package/sharp): A high-performance image processing library.

You can install these libraries by running the following commands in the terminal:

```bash
npm install node-lame
npm install fluent-ffmpeg
npm install sharp
```

## License

This project is distributed under the [ISC License](LICENSE).

```

```
