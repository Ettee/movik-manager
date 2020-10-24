import firebase from 'firebase';
  var firebaseConfig = {
    apiKey: "AIzaSyBHxc5wGmkXRnFaumfg2sggcuThYQ8uZFc",
    authDomain: "movik-manager-2b932.firebaseapp.com",
    databaseURL: "https://movik-manager-2b932.firebaseio.com",
    projectId: "movik-manager-2b932",
    storageBucket: "movik-manager-2b932.appspot.com",
    messagingSenderId: "156042077166",
    appId: "1:156042077166:web:a199e53f446125329664ff",
    measurementId: "G-FXQ2ZY1VMM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  export default firebase;