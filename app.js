const sha1 = require('sha1');
const AWS = require("aws-sdk");
require("dotenv").config();
//used for CLI prompts
const inquirer = require("inquirer");
const firebaseDB = require('./firebaseConfig');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const listRootDirectoriesParams = {
  Bucket: "atlscribes.org-recordings",
  MaxKeys: 200,
  Delimiter: "/",
};

const getParams = {
  Bucket: "atlscribes.org-recordings",
  Key: "2020-06-15 Full Council/VoiceMessage (1).wav",
};

// s3.getObject(getParams, function (err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data.Body);
//   }
// });

/**
 * @func chooseDirectoryPrompt prompts the user to select directories to import to Firebase
 */
function chooseDirectoryPrompt() {
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "answer",
        message: "Select a directory of public comments to import to firebase.",
        choices: directoryList,
      },
    ])
    .then((res) => {
      const directoriesToImport = res.answer;
      console.log(
        `Transferring the following directories to Firebase: ${directoriesToImport}`
      );
        for(let i = 0; i < directoriesToImport.length; i++){
            const directoriesToTransferParams = {
                Bucket: "atlscribes.org-recordings",
                Prefix: directoriesToImport[i]
              };
              s3.listObjectsV2(directoriesToTransferParams, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  console.log(data);
                }
              });
        }
    });
}

const directoryList = [];
s3.listObjectsV2(listRootDirectoriesParams, (err, data) => {
  if (err) {
    reject(err);
  } else {
    data.CommonPrefixes.forEach((dir) => {
      directoryList.push(dir.Prefix);
    });
    chooseDirectoryPrompt();
  }
});
