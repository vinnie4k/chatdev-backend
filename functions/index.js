// Firebase SDK
const { onRequest } = require("firebase-functions/v2/https");
const { getFirestore, FieldValue } = require("firebase-admin/firestore");
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
    time: new Date().toISOString().replace(/.\d+Z$/g, "Z"),
  };

  try {
    await db.collection("posts").doc(id).set(data);
    return res.status(201).json(data);
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * This route adds a user to a post's liked users
 *
 * - post_id (String): the ID of the post
 * - net_id (String): the NetID of the user
 */
app.post("/api/posts/like/", async (req, res) => {
  const postId = req.body.post_id;
  const netId = req.body.net_id;

  if (postId == null || netId == null) {
    return res
      .status(400)
      .send("Missing parameter `post_id` or `net_id` from request body");
  }

  try {
    // Fetch the current post
    const doc = await db.collection("posts").doc(postId).get();

    // Only add if post does not contain netid
    if (!doc.data().likes.includes(netId)) {
      await db
        .collection("posts")
        .doc(postId)
        .update({
          likes: FieldValue.arrayUnion(netId),
        });

      // Fetch updated post
      const doc = await db.collection("posts").doc(postId).get();
      return res.status(201).json(doc.data());
    } else {
      return res.status(400).send("The user has already liked this post.");
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

/**
 * This route removes a user from a post's liked users
 *
 * - post_id (String): the ID of the post
 * - net_id (String): the NetID of the user
 */
app.post("/api/posts/unlike/", async (req, res) => {
  const postId = req.body.post_id;
  const netId = req.body.net_id;

  if (postId == null || netId == null) {
    return res
      .status(400)
      .send("Missing parameter `post_id` or `net_id` from request body");
  }

  try {
    // Fetch the current post
    const doc = await db.collection("posts").doc(postId).get();

    // Only remove if post contains netid
    if (doc.data().likes.includes(netId)) {
      await db
        .collection("posts")
        .doc(postId)
        .update({
          likes: FieldValue.arrayRemove(netId),
        });

      // Fetch updated post
      const doc = await db.collection("posts").doc(postId).get();
      return res.status(201).json(doc.data());
    } else {
      return res.status(400).send("The user did not like this post.");
    }
  } catch (error) {
    return res.status(400).send(error);
  }
});

exports.chatdev = onRequest({ region: "us-east1" }, app);
