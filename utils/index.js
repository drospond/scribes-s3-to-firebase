require("dotenv").config();
const s3 = require("../databaseConfig/s3Config");

/**
 * 
 * @param text firebase object key
 */
const urlEncodeS3Key = function(text){
    return `https://s3.us-east-1.amazonaws.com/atlscribes.org-recordings/${encodeURIComponent(text)}`
}

const constructEntryObject = function(textFile, wavFile){
    const getParams = {
        Bucket: "atlscribes.org-recordings",
        Key: textFile.Key,
    };
    s3.getObject(getParams, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            entryObject ={
                wavURl: urlEncodeS3Key(wavFile.Key),
                wavETag: wavFile.ETag,
                text: data.Body.toString()
            }
            return entryObject;
        }
    });
}

const entryPairing = function (entries) {
    for (let i = 0; i < entries.length; i++) {
      let textFile = false;
      let wavFile = false;
      const fileExtension = entries[i].Key.split(".").pop();
      const entryKey = entries[i].Key.substr(0, entries[i].Key.length - 4);
      if (fileExtension === "txt") {
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
        constructEntryObject(textFile, wavFile);
      }
    }
  };