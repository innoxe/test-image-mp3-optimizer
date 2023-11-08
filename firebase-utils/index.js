const admin = require("firebase-admin");
const { Storage } = require("@google-cloud/storage");

// Configure Firebase Admin
const serviceAccount = require("./firebase-credentials.json"); // Specify your Service Account Key
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Configure firebase storage
const gcs = new Storage();
const bucket = gcs.bucket("function-test-14ab6.appspot.com"); // Specify the name of your bucket

class FirebaseStorageClass {
  constructor(pathFile) {
    this.pathFile = pathFile; // Format date/time utility function for all services
    this.file = bucket.file(this.pathFile);
  }

  async getMetaData() {
    try {
      const [metadata] = await this.file.getMetadata();
      return metadata;
    } catch (error) {
      console.error("Error on get metadata:", error);
    }
  }

  async getBuffer() {
    try {
      const [downloadResponse] = await this.file.download();
      console.log(`We get buffer from file ${this.pathFile} in firebase`);
      // Get buffer of file
      return downloadResponse;
    } catch (error) {
      console.error("Error on get buffer from download file:", error);
    }
  }
}

module.exports = FirebaseStorageClass;
