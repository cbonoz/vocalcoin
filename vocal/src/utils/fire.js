import firebase from 'firebase'
// import { socket } from './api';

const config = {
    apiKey: process.env.REACT_APP_FIRE_KEY,
    authDomain: "vocal.firebaseapp.com",
    databaseURL: "https://vocal.firebaseio.com",
    projectId: "vocal",
    storageBucket: "",
    messagingSenderId: "1005405342008"
};
firebase.initializeApp(config)

export const fbLogin = function() {
    firebase.auth().signInWithPopup(provider).then(function (result) {
        // This gives you a Facebook Access Token. You can use it to access the Facebook API.
        var token = result.credential.accessToken;
        var user = result.user;

        const guestName = result.user.displayName || 'A guest';
        const nameArray = guestName.split(' ');
        const firstName = nameArray[0];
        const eventName = `${firstName} just logged in.`;
        console.log('event: ', eventName);

        // socket.emit('action', { name: eventName, time: Date.now() }, (data) => {
        //     console.log('action ack', data);
        // });
    }).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        var credential = error.credential;
        
        console.error(errorCode, errorMessage, credential, email);
    });
}

export const ref = firebase.database().ref()
export const provider = new firebase.auth.FacebookAuthProvider();
export const firebaseAuth = firebase.auth