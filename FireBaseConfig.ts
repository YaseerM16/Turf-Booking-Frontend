// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA5dUFxjLD3CGroXk7j_tIoSbspUzzfSlU",
    authDomain: "turf-frontend-2-auth.firebaseapp.com",
    projectId: "turf-frontend-2-auth",
    storageBucket: "turf-frontend-2-auth.firebasestorage.app",
    messagingSenderId: "136733115789",
    appId: "1:136733115789:web:032489d92349104ac229c4",
    measurementId: "G-XT5G40D231"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);