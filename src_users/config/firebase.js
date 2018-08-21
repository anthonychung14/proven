import * as firebase from "firebase";

import { FirebaseConfig } from "./keys";
firebase.initializeApp(FirebaseConfig);

const databaseRef = firebase.database().ref();
export const todosRef = databaseRef.child("questions");
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
