import { db } from "../configs/firebase.js";
import { getAuth } from "firebase-admin/auth";

const createUser = async (req, res) => {
  try {
    const { fullname, username } = req.body;

    if (
      typeof fullname !== "string" ||
      !fullname.trim() ||
      typeof username !== "string" ||
      !username.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Full name and username are required.",
      });
    }

    // Require a verified Firebase ID token.
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

    const userRef = db.collection("users").doc(uid);
    const existingUser = await userRef.get();

    if (existingUser.exists) {
      return res.status(409).json({
        success: false,
        message: "User profile already exists.",
      });
    }

    const userData = {
      uid,
      fullname: fullname.trim(),
      username: username.trim(),
      email: decodedToken.email || "",
      photoURL: decodedToken.picture || "",
      provider: decodedToken.firebase?.sign_in_provider || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await userRef.create(userData);

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
    if (
      error.code === "auth/id-token-expired" ||
      error.code === "auth/argument-error"
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

export default { createUser };
