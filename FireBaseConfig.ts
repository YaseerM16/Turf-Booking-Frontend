import { APIKEY, AUTH_DOMAIN, MEASUREMENT_ID, MESSAGING_APP_ID, MESSAGING_SENDER_ID, PROJECT_ID, STORAGE_BUCKET } from '@/utils/constants';
import { initializeApp } from 'firebase/app';
import { getAuth } from "firebase/auth";
// import { APIKEY, AUTHDOMAIN, PROJECT_ID, MESSAGINGSENDER_ID, APP_ID, MEASUREMENT_ID, STORAGEBUCKET } from "@/utils/constant";
import 'firebase/storage'


const firebaseConfig = {
    apiKey: APIKEY,
    authDomain: AUTH_DOMAIN,
    projectId: PROJECT_ID,
    storageBucket: STORAGE_BUCKET,
    messagingSenderId: MESSAGING_SENDER_ID,
    appId: MESSAGING_APP_ID,
    measurementId: MEASUREMENT_ID
};

export const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default auth