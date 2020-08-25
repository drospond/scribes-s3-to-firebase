var sha1 = require('sha1');
var AWS = require ('aws-sdk');

var s3 = new AWS.S3({ accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY });

console.log(s3);