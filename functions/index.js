/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const app = express();

const admin = require("firebase-admin");
const serviceAccount = "./service_account_key.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

/* Routes */

app.get("/", (req, res) => {
  res.send("Welcome to ChatDev's Backend!");
});

exports.app = onRequest({region: "us-east1"}, app);