var firebase = require("firebase/app");

require("firebase/auth");
require("firebase/database");

import { FirebaseConfig } from "./dev";

firebase.initializeApp(FirebaseConfig);

const databaseRef = firebase.database().ref();
export const answers = databaseRef.child("answers");
export const questions = databaseRef.child("questions");
export const authRef = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
