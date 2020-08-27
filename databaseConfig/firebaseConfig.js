const admin = require("firebase-admin");

const serviceAccount = require("../firebaseAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

const collectionRef = db.collection("sessions");

module.exports = collectionRef;
