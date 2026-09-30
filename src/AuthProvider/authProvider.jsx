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
import Swal from "sweetalert2";
import app from "../Component/Firebase/firebase.config";
import api from "../api/api";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [dbUser, setDbUser] = useState(null); // role, status, suspendReason, etc.
  const [loading, setLoading] = useState(true);

  const googleProvider = new GoogleAuthProvider();

  // Sync with Backend JWT & DB User
  const syncBackendUser = async (email, profileData = null) => {
    try {
      // 1. Get JWT token
      const jwtRes = await api.post("/jwt", { email });
      if (jwtRes.data?.token) {
        localStorage.setItem("garments_access_token", jwtRes.data.token);
      }

      // 2. Fetch or save user in DB
      let userRes;
      try {
        userRes = await api.get(`/users/${email}`);
        setDbUser(userRes.data);
      } catch (err) {
        if (err.response?.status === 404 && profileData) {
          const createRes = await api.post("/users", profileData);
          setDbUser(createRes.data?.user || profileData);
        }
      }
    } catch (err) {
      console.error("Backend sync error:", err);
    }
  };

  // 🔹 Register User
  const registerUser = async (name, email, photoURL, password, role = "buyer") => {
    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, {
        displayName: name,
        photoURL: photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
      });

      const userPayload = {
        name,
        email,
        photoURL: photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role,
        status: "pending",
      };

      await api.post("/users", userPayload);
      await syncBackendUser(email, userPayload);

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: `Welcome to GarmentsTracker, ${name}! Your account is created as ${role.toUpperCase()}.`,
        timer: 2500,
        showConfirmButton: false,
      });

      return res;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message || "An unexpected error occurred during registration.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Log In User
  const logInUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      await syncBackendUser(email);
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Logged in successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      return res;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: error.message || "Invalid credentials. Please check your email and password.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Google Login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const googleUser = res.user;

      const userPayload = {
        name: googleUser.displayName || "Google User",
        email: googleUser.email,
        photoURL: googleUser.photoURL || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
        role: "buyer",
        status: "pending",
      };

      await api.post("/users", userPayload);
      await syncBackendUser(googleUser.email, userPayload);

      Swal.fire({
        icon: "success",
        title: "Google Login Successful",
        text: `Logged in as ${googleUser.displayName || googleUser.email}!`,
        timer: 2000,
        showConfirmButton: false,
      });

      return res;
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Google Authentication Error",
        text: error.message || "Could not complete Google sign in.",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Quick Demo Login for instant testing without manual Firebase credential setup
  const demoLogin = async (roleName) => {
    setLoading(true);
    try {
      let email = "admin@garmentstracker.com";
      let displayName = "System Administrator";
      let photoURL = "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80";

      if (roleName === "manager") {
        email = "manager@garmentstracker.com";
        displayName = "Tariqul Production Head";
        photoURL = "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80";
      } else if (roleName === "buyer") {
        email = "buyer@garmentstracker.com";
        displayName = "Apex Fashion Buyer";
        photoURL = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80";
      }

      // Sync backend token & DB data
      const jwtRes = await api.post("/jwt", { email });
      if (jwtRes.data?.token) {
        localStorage.setItem("garments_access_token", jwtRes.data.token);
      }

      const userRes = await api.get(`/users/${email}`);
      const fetchedUser = userRes.data;

      const mockFirebaseUser = {
        email,
        displayName,
        photoURL,
        uid: `demo_${roleName}_uid`,
      };

      setUser(mockFirebaseUser);
      setDbUser(fetchedUser);

      Swal.fire({
        icon: "success",
        title: `Logged in as ${roleName.toUpperCase()}`,
        text: `Active session for ${displayName}`,
        timer: 1800,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Demo login error:", err);
      Swal.fire({
        icon: "error",
        title: "Demo Login Failed",
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Logout
  const logOut = async () => {
    setLoading(true);
    try {
      await api.post("/logout", {});
      localStorage.removeItem("garments_access_token");
      try {
        await signOut(auth);
      } catch (e) {
        // demo user signOut fallback
      }
      setUser(null);
      setDbUser(null);
      Swal.fire({
        icon: "info",
        title: "Logged Out",
        text: "You have been logged out safely.",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Firebase Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser?.email) {
        setUser(currentUser);
        await syncBackendUser(currentUser.email);
      } else {
        // If no firebase user, check if we have a demo token session
        const storedToken = localStorage.getItem("garments_access_token");
        if (!storedToken) {
          setUser(null);
          setDbUser(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    dbUser,
    loading,
    setDbUser,
    registerUser,
    logInUser,
    googleLogin,
    demoLogin,
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