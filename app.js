require("dotenv").config();
//used for CLI prompts
const inquirer = require("inquirer");
const fbUtils = require("./firebaseUtils");
const s3 = require("./databaseConfig/s3Config");

const listRootDirectoriesParams = {
  Bucket: "atlscribes.org-recordings",
  MaxKeys: 200,
  Delimiter: "/",
};

/**
 * @func chooseDirectoryPrompt prompts the user to select directories to import to Firebase
 */
function chooseDirectoryPrompt() {
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "answer",
        message: "Select one or more session directories of public comments to import to firebase.",
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
                  fbUtils.importToFireBase(data.Contents, directoriesToImport[i])
                }
              });
        }
    });
}

const directoryList = [];

//Gets session names in S3 and starts prompt
s3.listObjectsV2(listRootDirectoriesParams, (err, data) => {
  if (err) {
    reject(err);
  } else {
    data.CommonPrefixes.forEach((dir) => {
      directoryList.push(dir.Prefix);
    });
    console.log("Welcome to the S3 to Firestore CLI for Atlscribes.");
    console.log("Use the arrow keys to scroll through and select sessions to import with the space bar. Press enter to confirm.");
    chooseDirectoryPrompt();
  }
});
