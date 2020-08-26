// const sha1 = require('sha1');
const AWS = require("aws-sdk");
require("dotenv").config();
const inquirer = require("inquirer");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const getParams = {
  Bucket: "atlscribes.org-recordings",
  Key: "2020-06-15 Full Council/VoiceMessage (1).wav",
};

// const storage = new Storage({
//     keyFilename: <server-key-file-path>,
//  });

// s3.getObject(getParams, function (err, data) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(data.Body);
//   }
// });

const listObjectParams = {
  Bucket: "atlscribes.org-recordings",
  MaxKeys: 20,
  Delimiter: "/",
};

const directories = [];
s3.listObjectsV2(listObjectParams, (err, data) => {
  if (err) {
    reject(err);
  }else {
    data.CommonPrefixes.forEach(dir => {
        directories.push(dir.Prefix);
    })
    // console.log(directories);
  }
});

function testPrompt(){
    inquirer.prompt([
        {
          type: "checkbox",
          name: "answer",
          message: "Select a directory of public comments to import to firebase.",
          choices: directories
        }
      ]).then((res)=>{
          console.log(`Your answer: ${res.answer}`);
    })
  }

  testPrompt();
