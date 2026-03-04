import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import PropTypes from "prop-types";
import { createContext, useEffect, useState } from "react";
import axios from "axios";
import app from "../Component/Firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // 🔥 role & status
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // 🔹 Register
  const registerUser = async (name, email, photoURL, password) => {
    setLoading(true);
    const res = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(res.user, {
      displayName: name,
      photoURL,
    });

    return res;
  };

  // 🔹 Login
  const logInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔹 Google Login
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // 🔹 Logout
  const logOut = async () => {
    await axios.post(
      "http://localhost:5000/logout",
      {},
      { withCredentials: true }
    );
    return signOut(auth);
  };

  // 🔥 Important: Firebase + JWT Sync
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // 1️⃣ Get JWT token from backend
          await axios.post(
            "http://localhost:5000/jwt",
            { email: currentUser.email },
            { withCredentials: true }
          );

          // 2️⃣ Fetch user from DB (role + status)
          const res = await axios.get(
            `http://localhost:5000/users/${currentUser.email}`,
            { withCredentials: true }
          );

          setDbUser(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setDbUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    dbUser,
    loading,
    registerUser,
    logInUser,
    googleLogin,
    logOut,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;