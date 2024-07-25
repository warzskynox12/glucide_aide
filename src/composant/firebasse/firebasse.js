import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBK5lfBxpaULA44SROM0GH5Yfk5JFzQRZg",
  authDomain: "glucide-aide.firebaseapp.com",
  projectId: "glucide-aide",
  storageBucket: "glucide-aide.appspot.com",
  messagingSenderId: "1054736299280",
  appId: "1:1054736299280:web:915fbb15466dfc556de195",
  measurementId: "G-QWFL4ZE8M1"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export default firebase;