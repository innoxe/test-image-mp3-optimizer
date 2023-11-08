const mainTest = require("./test-utils/main-test");

// Define the file path to the image or MP3 file in Firebase storage
const imageFilePath = "images/5550970_2880645.jpg";
const mp3FilePath =
  "mp3/audio_www.everyeye.it_articoli-speciale-alan-wake-riassunto-imperdibile-storia-pronti-61338-html.mp3";

// Call the main function, specifying the module to use for MP3 optimization (1 for FFMPEG, 0 for node-lame)
mainTest(mp3FilePath, 1); // Test MP3 optimization using FFMPEG
//mainTest(imageFilePath); // Test image optimization
