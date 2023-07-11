// Firebase SDK
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore } = require("firebase-admin/firestore");
const admin = require("firebase-admin");
const serviceAccount = "./service_account_key.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Other Dependencies
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors({ origin: true }));
app.use(express.json());

// Constants
const db = getFirestore();

// ======= Routes =======

/**
 * Default Route
 */
app.get("/", (req, res) => {
  return res.status(200).send("Welcome to ChatDev's Backend!");
});

/**
 * This route returns all posts
 */
app.get("/api/posts/", async (req, res) => {
  const snapshot = await db.collection("posts").get();

  let posts = [];
  snapshot.forEach((doc) => {
    posts.push(doc.data());
  });

  return res.status(200).json(posts);
});

exports.chatdev = onRequest({ region: "us-east1" }, app);
