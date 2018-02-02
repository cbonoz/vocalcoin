import firebase from 'firebase'
// import { socket } from './api';

  // Initialize Firebase
  var config = {
    apiKey: process.env.REACT_APP_VOCAL_FIRE_KEY,
    authDomain: "vocalcoin-69799.firebaseapp.com",
    databaseURL: "https://vocalcoin-69799.firebaseio.com",
    projectId: "vocalcoin-69799",
    // storageBucket: "vocalcoin-69799.appspot.com",
    // messagingSenderId: "181951805420"
  };
  firebase.initializeApp(config);


export const provider = new firebase.auth.EmailAuthProvider();

export const createUser = function(email, password) {
    // If the new account was created, the user is signed in automatically.
    return firebase.auth().createUserWithEmailAndPassword(email, password);
}

export const signInUser = function(email, password) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
}

export const ref = firebase.database().ref()
export const firebaseAuth = firebase.auth