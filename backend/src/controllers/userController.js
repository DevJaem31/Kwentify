import { db } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";

const createUser = async (req, res) => {
  try {
    const { fullname, username } = req.body ?? {};

    if (
      typeof fullname !== "string" ||
      !fullname.trim() ||
      typeof username !== "string" ||
      !/^[a-zA-Z0-9_]{3,30}$/.test(username.trim())
    ) {
      return res.status(400).json({
        success: false,
        message:
          "A full name and a username of 3–30 letters, numbers, or underscores are required.",
      });
    }

    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication is required.",
      });
    }

    const idToken = authorization.slice(7);
    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    const normalizedUsername = username.trim().toLowerCase();

    const userRef = db.collection("users").doc(uid);
    const usernameRef = db.collection("usernames").doc(normalizedUsername);

    const userData = {
      uid,
      fullname: fullname.trim(),
      username: username.trim(),
      usernameLowercase: normalizedUsername,
      email: decodedToken.email || "",
      photoURL: decodedToken.picture || "",
      provider: decodedToken.firebase?.sign_in_provider || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.runTransaction(async (transaction) => {
      const usernameSnapshot = await transaction.get(usernameRef);
      const userSnapshot = await transaction.get(userRef);

      if (usernameSnapshot.exists) {
        const error = new Error("USERNAME_TAKEN");
        error.code = "USERNAME_TAKEN";
        throw error;
      }

      if (userSnapshot.exists) {
        const error = new Error("PROFILE_EXISTS");
        error.code = "PROFILE_EXISTS";
        throw error;
      }

      transaction.create(usernameRef, {
        uid,
        username: normalizedUsername,
        createdAt: new Date(),
      });

      transaction.create(userRef, userData);
    });

    return res.status(201).json({
      success: true,
      message: "User profile created successfully.",
      data: {
        uid,
        fullname: userData.fullname,
        username: userData.username,
        email: userData.email,
        photoURL: userData.photoURL,
        provider: userData.provider,
      },
    });
  } catch (error) {
    if (error.code === "USERNAME_TAKEN") {
      return res.status(409).json({
        success: false,
        message:
          "This username is already taken. Please choose another username.",
      });
    }

    if (error.code === "PROFILE_EXISTS") {
      return res.status(409).json({
        success: false,
        message: "Your user profile already exists.",
      });
    }

    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/argument-error" ||
      error.code === "auth/invalid-id-token"
    ) {
      return res.status(401).json({
        success: false,
        message: "Your session is invalid or expired. Please sign in again.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Unable to create user profile.",
    });
  }
};

const loginLookup = async (req, res) => {
  try {
    const username = req.body?.username;

    if (typeof username !== "string" || !username.trim()) {
      return res.status(400).json({
        success: false,
        message: "Username is required.",
      });
    }

    const normalizedUsername = username.trim().toLowerCase();

    const snapshot = await db
      .collection("users")
      .where("usernameLowercase", "==", normalizedUsername)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const userData = snapshot.docs[0].data();

    if (!userData.email) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    return res.status(200).json({
      success: true,
      email: userData.email,
    });
  } catch {
    return res.status(500).json({
      success: false,
      message: "Unable to sign in right now. Please try again.",
    });
  }
};

export default { createUser, loginLookup };
