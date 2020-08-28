require("dotenv").config();
const s3 = require("../databaseConfig/s3Config");
const firebaseDB = require("../databaseConfig/firebaseConfig");

/**
 * @func urlEncodeS3Key converts S3 file key into accessible URL
 * @param text firebase object key
 */
const urlEncodeS3Key = function (text) {
  return `https://s3.us-east-1.amazonaws.com/atlscribes.org-recordings/${encodeURIComponent(
    text
  )}`;
};

/**
 * @func setFirebaseObject constucts object from S3 text and wav file and saves to Firebase
 * @param {Object} textFile - S3 object of entry text file
 * @param {Object} wavFile -S3 object of entry wav audio file
 * @param {string} sessionDirectory - directory name of current session for entries
 */
const setFirebaseObject = function (textFile, wavFile, sessionDirectory) {
  const getParams = {
    Bucket: "atlscribes.org-recordings",
    Key: textFile.Key,
  };
  s3.getObject(getParams, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      const entryObject = {
        wavURl: urlEncodeS3Key(wavFile.Key),
        text: data.Body.toString(),
        status: "new",
        leased: false,
      };
      const docRef = firebaseDB
        .doc(sessionDirectory)
        .collection("entries")
        .doc(wavFile.ETag);
      docRef.set({ entryObject });
    }
  });
};

/**
 * @func importToFireBase imports session entries into Firebase
 * @param {Object[]} entries - entries of current session to import
 * @param {string} sessionDirectory - directory name of current session for entries
 */
exports.importToFireBase = function (entries, sessionDirectory) {
  let entryImportCount = 0;
  for (let i = 0; i < entries.length; i++) {
    let textFile = false;
    let wavFile = false;
    const fileExtension = entries[i].Key.split(".").pop();
    const entryKey = entries[i].Key.substr(0, entries[i].Key.length - 4);
    if (fileExtension === "wav") {
      textFile = entries.find((entry) => {
        if (entry.Key === `${entryKey}.txt`) return true;
      });
      if (!textFile) {
        console.log("No match found for: ", entries[i].Key);
      }
    } else if (fileExtension === "txt") {
      textFile = entries[i];
      wavFile = entries.find((entry) => {
        if (entry.Key === `${entryKey}.wav`) return true;
      });
      if (!wavFile) {
        console.log("No match found for: ", entries[i].Key);
      }
    } else {
      continue;
    }
    if (textFile && wavFile) {
      setFirebaseObject(textFile, wavFile, sessionDirectory);
      entryImportCount++;
    }
  }
  console.log(`Imported ${entryImportCount} entries for ${sessionDirectory}`);
};
