import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
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
    body: JSON.stringify({ fullname, username }),
  });

  const result = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(result?.message || "Unable to save your profile.");
  }

  return result;
}

function getLoginErrorMessage(error) {
  const messages = {
    "auth/invalid-credential": "Invalid username or password.",
    "auth/user-not-found": "Invalid username or password.",
    "auth/wrong-password": "Invalid username or password.",
    "auth/too-many-requests":
      "Too many sign-in attempts. Please try again later.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
  };

  if (messages[error?.code]) {
    return messages[error.code];
  }

  if (error?.message === "Failed to fetch") {
    return "Cannot connect to the Kwentify server. Check that your backend is running.";
  }

  return "Unable to sign in. Please try again.";
}

export async function signInWithUsername(username, password) {
  const normalizedUsername = username.trim().toLowerCase();

  if (!normalizedUsername || !password) {
    throw new Error("Please enter your username and password.");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/users/login-lookup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: normalizedUsername,
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok || !result?.email) {
      throw new Error("Invalid username or password.");
    }

    const credential = await signInWithEmailAndPassword(
      auth,
      result.email,
      password,
    );

    return credential.user;
  } catch (error) {
    if (error.message === "Invalid username or password.") {
      throw error;
    }

    throw new Error(getLoginErrorMessage(error), {
      cause: error,
    });
  }
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
    typeof password !== "string" ||
    !fullname.trim() ||
    !username.trim() ||
    !email.trim() ||
    !password
  ) {
    throw new Error("Please complete all required fields.");
  }

  const normalizedFullname = fullname.trim();
  const normalizedUsername = username.trim();
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const credential = await createUserWithEmailAndPassword(
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

    return credential.user;
  } catch (error) {
    throw new Error(getAuthErrorMessage(error), {
      cause: error,
    });
  }
}

export async function resetPassword(email) {
  if (typeof email !== "string" || !email.trim()) {
    throw new Error("Please enter your email address.");
  }

  try {
    await sendPasswordResetEmail(auth, email.trim().toLowerCase());

    return {
      success: true,
      message:
        "If an account exists for that email, a password reset link has been sent. Please check your inbox.",
    };
  } catch (error) {
    throw new Error(
      "Unable to send the reset email. Please check the email address and try again.",
      { cause: error },
    );
  }
}

function getAuthErrorMessage(error) {
  const messages = {
    "auth/email-already-in-use":
      "This email address is already registered. Please sign in instead.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password":
      "Your password does not meet the security requirements.",
    "auth/popup-closed-by-user": "The Google sign-in window was closed.",
    "auth/popup-blocked": "Your browser blocked the Google sign-in window.",
    "auth/network-request-failed":
      "Network error. Please check your connection.",
    "auth/operation-not-allowed": "This sign-in method is not enabled.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/account-exists-with-different-credential":
      "An account may already exist with this email using another sign-in method. Try signing in with that method.",
  };

  if (error?.code && messages[error.code]) {
    return messages[error.code];
  }

  if (error?.message === "Failed to fetch") {
    return "Cannot connect to the Kwentify server. Check that your backend is running.";
  }

  return error?.message || "Unable to create your account. Please try again.";
}
