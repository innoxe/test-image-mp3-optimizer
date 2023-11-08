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
    this.pathFile = pathFile;

    try {
      if (!bucket) {
        throw new Error("Bucket not defined");
      }

      this.initializeFile().catch((error) => {
        console.error("File initialization error:", error);
      });
    } catch (error) {
      console.error("Error in constructor:", error);
    }
  }

  async initializeFile() {
    this.file = bucket.file(this.pathFile);
    const isExist = await this.isFileExist();

    if (!isExist) {
      throw new Error("The file does not exist in storage");
    }

    if (!this.file) {
      throw new Error("File initialization error");
    }
  }

  async getMetaData() {
    try {
      const [metadata] = await this.file.getMetadata();
      return metadata;
    } catch ({ name, message }) {
      console.error("Error on get metadata:", message);
    }
  }

  async getBuffer() {
    try {
      const [downloadResponse] = await this.file.download();
      console.log(`We get buffer from file ${this.pathFile} in firebase`);
      return downloadResponse;
    } catch (error) {
      console.error("Error on get buffer from download file:", error);
    }
  }

  async isFileExist() {
    const [fileExist] = await this.file.exists();
    return fileExist;
  }
}

module.exports = FirebaseStorageClass;
