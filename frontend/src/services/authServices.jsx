import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";

import { auth } from "../../firebase.js";

const googleProvider = new GoogleAuthProvider();

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

async function saveUserProfile(user, { fullname, username }) {
  const idToken = await user.getIdToken();

  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`,
    },
    body: JSON.stringify({
      fullname,
      username,
    }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Unable to save your profile.");
  }

  return result;
}

export async function signUpWithEmail({
  fullname,
  username,
  email,
  password,
} = {}) {
  if (
    typeof fullname !== "string" ||
    typeof username !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    throw new Error("Please complete all required fields.");
  }

  const normalizedFullname = fullname.trim();
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (
    !normalizedFullname ||
    !normalizedUsername ||
    !normalizedEmail ||
    !password
  ) {
    throw new Error("Please complete all required fields.");
  }

  let credential;

  try {
    credential = await createUserWithEmailAndPassword(
      auth,
      normalizedEmail,
      password,
    );

    await updateProfile(credential.user, {
      displayName: normalizedFullname,
    });

    await saveUserProfile(credential.user, {
      fullname: normalizedFullname,
      username: normalizedUsername,
    });

    return credential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error), {
      cause: error,
    });
  }
}

export async function signUpWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, googleProvider);
    const user = credential.user;

    return user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error), {
      cause: error,
    });
  }
}

function getAuthErrorMessage(error) {
  const code = error?.code;

  const messages = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password":
      "Your password does not meet the security requirements.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/operation-not-allowed": "This sign-in method is not enabled.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/email-already-exists": "This email address is already registered.",
    "auth/invalid-id-token":
      "Your session could not be verified. Please sign in again.",
  };

  if (code && messages[code]) {
    return messages[code];
  }

  if (error?.message === "Failed to fetch") {
    return "Cannot connect to the Kwentify server. Check that your backend is running.";
  }

  return error?.message || "Unable to create your account. Please try again.";
}
