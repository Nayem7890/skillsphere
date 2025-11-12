// src/Providers/AuthProvider.jsx
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { auth } from "../firebase/firebase.config";


const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Keep user + token in sync with Firebase
  useEffect(() => {
    const unsub = onIdTokenChanged(auth, async (currentUser) => {
      setLoading(true);
      setUser(currentUser);

      if (currentUser) {
        try {
          const token = await currentUser.getIdToken();
          setIdToken(token);
        } catch (err) {
          console.error("Failed to get ID token:", err);
          setIdToken(null);
        }
      } else {
        setIdToken(null);
      }

      setLoading(false);
    });

    return () => unsub();
  }, []);

  // --- Auth methods (unchanged logic, just rely on onIdTokenChanged) ---
  const register = async (email, password, name, photoURL) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, {
        displayName: name,
        photoURL: photoURL || null,
      });
      toast.success("Registration successful!");
      return cred.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login successful!");
      return cred.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const googleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      toast.success("Google login successful!");
      return cred.user;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  // Helper to always get a fresh token when needed
  const getIdToken = async (forceRefresh = false) => {
    if (!auth.currentUser) return null;
    const token = await auth.currentUser.getIdToken(forceRefresh);
    setIdToken(token);
    return token;
  };

  const value = {
    user,
    loading,
    idToken,
    getIdToken,   // 👈 expose this for axios calls if needed
    register,
    login,
    googleLogin,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
