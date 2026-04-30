// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDH0jggaMAMkw7JSJG35CNRwyh18NUxqYo",
  authDomain: "sugartrack-59d21.firebaseapp.com",
  projectId: "sugartrack-59d21",
  appId: "1:1016252984543:web:88a2254a6faae52d0ccd6a",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);