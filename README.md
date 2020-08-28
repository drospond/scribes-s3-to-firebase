# scribes-s3-to-firebase
Tool to move public comment files from S3 to firebase

## Installation
1. Clone the repo

2. You'll need to reuest database credentials for S3 and for Firestore
    * Create a file '.env' in the root and paste in the S3 credentials
    * Create a file 'firebaseAccountKey.json' in the root and paste in the Firestore credentials

3. In the termianl run:
```
npm install
```
4. To start the app, in the termianl run:
```
node app.js 
```
