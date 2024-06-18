import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBxsrDwSoORXlSuY9xJvfFsm4mJqvlMxAQ",
  authDomain: "student-space-87ed1.firebaseapp.com",
  projectId: "student-space-87ed1",
  storageBucket: "student-space-87ed1.appspot.com",
  messagingSenderId: 19493542140,
  appId: "1:19493542140:web:664afb87ef1b55f4b39f79",
  measurementId: " G-JQK9YT4LNC",
  dataBaseURL: "https://student-space-87ed1-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const provider = new GoogleAuthProvider();
 
export { auth, provider, app };
