var admin = require("firebase-admin");

var serviceAccount = require("../key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

let newsRef = db.collection("News");
let resultRef = db.collection("Result");
let schoolRef = db.collection("School");
let studentRef = db.collection("Student");
let userRef = db.collection("User");
let zoneRef = db.collection("Zone");

newsRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
resultRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
schoolRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
studentRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
userRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
zoneRef.get().then((querySnapshot) => {
  querySnapshot.forEach(document => {
    console.log(document.data());
  })
});
