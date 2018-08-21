import { database, auth } from "firebase";

const config = {
  apiKey: "AIzaSyBAw9WJ5SZ9PgEA5I-HYlJuMxFgIN14bNc",
  authDomain: "saga-two-you.firebaseapp.com",
  databaseURL: "https://saga-two-you.firebaseio.com",
  projectId: "saga-two-you",
  storageBucket: "saga-two-you.appspot.com",
  messagingSenderId: "232833390558"
};

firebase.initializeApp(config);

const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("questions");
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
