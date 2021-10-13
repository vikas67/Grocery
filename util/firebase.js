const firebase = require('firebase/app');

const {
    FB_API_KEY,
    FB_AUTH_DOMAIN,
    FB_PROJECT_ID,
    FB_STORAGE_BUCKET,
    FB_MESSAGING_SENDERID,
    FB_APP_ID,
    FB_MEASUREMENT_ID
} = process.env;

const firebaseConfig = {
    apiKey: FB_API_KEY,
    authDomain: FB_AUTH_DOMAIN,
    projectId: FB_PROJECT_ID,
    storageBucket: FB_STORAGE_BUCKET,
    messagingSenderId: FB_MESSAGING_SENDERID,
    appId: FB_APP_ID,
    measurementId: FB_MEASUREMENT_ID
};

const db = firebase.initializeApp(firebaseConfig);
module.exports = db;
