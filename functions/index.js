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
const { v4: uuidv4 } = require("uuid");

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
  try {
    const snapshot = await db.collection("posts").get();

    let posts = [];
    snapshot.forEach((doc) => {
      posts.push(doc.data());
    });

    return res.status(200).json(posts);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * This route adds a new post to the database given a message
 *
 * - message (String): the message of the post
 */
app.post("/api/posts/create/", async (req, res) => {
  const message = req.body.message;
  if (message == null) {
    return res
      .status(400)
      .send("Missing parameter `message` from request body");
  }

  const id = uuidv4();
  const data = {
    id: id,
    likes: [],
    message: message,
    time: new Date().toISOString(),
  };

  try {
    await db.collection("posts").doc(id).set(data);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).send(error);
  }
});

exports.chatdev = onRequest({ region: "us-east1" }, app);
