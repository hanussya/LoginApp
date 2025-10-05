"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); 
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);  
  const [show, setShow] = useState(false);         
  const [caps, setCaps] = useState(false);        
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.replace("/home");
    });
    return () => unsub();
  }, [router]);

  const validate = () => {
    if (mode === "register" && !fullName.trim()) {
      setMsg("Full name is required.");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMsg("Enter a valid email.");
      return false;
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    if (mode === "register" && !passwordRegex.test(password)) {
      setMsg("Password must be 8+ chars with one uppercase, one number, and one special (!@#$%^&*).");
      return false;
    }
    setMsg("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setMsg("");

    try {
      await setPersistence(
        auth,
        remember ? browserLocalPersistence : browserSessionPersistence
      );

      if (mode === "register") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: fullName.trim() });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      router.push("/home");
    } catch (err) {
      setMsg(err?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setMsg("Enter your email above to receive a reset link.");
      return;
    }
    setLoading(true);
    setMsg("");
    try {
      await sendPasswordResetEmail(auth, email);
      setMsg("Reset link sent. Check your inbox (and spam).");
    } catch (err) {
      setMsg( "Could not send reset link. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <div style={styles.headerBox}>
          <h1 style={styles.headerTitle}>
            {mode === "login" ? "Sign In" : "Create Account"}
          </h1>
        </div>

        <p style={{ color: "#556B2F", marginBottom: 20 }}>
          {mode === "login"
            ? "Welcome back. Please sign in to continue."
            : "Register with your full name, email and password."}
        </p>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {mode === "register" && (
            <label style={styles.label}>
              Full Name
              <input
                style={styles.input}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                autoComplete="name"
              />
            </label>
          )}

          <label style={styles.label}>
            Email
            <input
              type="email"
              style={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@example.com"
              autoComplete="email"
            />
          </label>

          <label style={styles.label}>
            Password
            <div style={{ position: "relative" }}>
              <input
                type={show ? "text" : "password"}
                style={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={(e) => setCaps(e.getModifierState && e.getModifierState("CapsLock"))}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
                style={styles.eyeBtn}
              >
                 {show ? <FaEyeSlash /> : <FaEye />} 
              </button>
            </div>
          </label>
          {caps && <small style={{ color: "#f59e0b" }}>Caps Lock is ON</small>}

          <div style={styles.row}>
            <label style={styles.remember}>
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ marginRight: 8 }}
              />
              Remember me
            </label>

            <button
              type="button"
              onClick={handleForgot}
              style={styles.textBtn}
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>

          {msg && <div style={styles.error}>{msg}</div>}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading
              ? "Please wait…"
              : mode === "login"
              ? "Sign In"
              : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: 16 }}>
          {mode === "login" ? (
            <>
              New here?{" "}
              <button style={styles.link} onClick={() => setMode("register")}>
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button style={styles.link} onClick={() => setMode("login")}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </main>
  );
}

const styles = {
  container: {
    minHeight: "100svh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    background: "#FAF9F6", 
  },
  card: {
    width: "100%",
    maxWidth: 460,
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: 16,
    padding: 28,
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
    color: "#1F1F1F",
  },
  headerBox: {
    width: "100%",
    textAlign: "center",
    padding: "12px 0",
    marginBottom: 20,
    background: "#556B2F", 
    borderRadius: 8,
  },
  headerTitle: {
    margin: 0,
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF", 
  },
  label: {
    display: "block",
    fontSize: 14,
    marginBottom: 10,
    color: "#556B2F",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    marginTop: 6,
    padding: "10px 12px",
    border: "1px solid #6B8E23", 
    borderRadius: 8,
    outline: "none",
    background: "#FAF9F6", 
    color: "#1F1F1F",
  },
  eyeBtn: {
    position: "absolute",
    right: 10,
    top: 8,
    background: "none",
    border: 0,
    cursor: "pointer",
    fontSize: 18,
    color: "#556B2F",
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 8,
  },
  remember: {
    display: "flex",
    alignItems: "center",
    color: "#333333",
    fontSize: 14,
  },
  textBtn: {
    background: "transparent",
    border: "none",
    color: "#6B8E23",
    cursor: "pointer",
    textDecoration: "underline",
    fontSize: 14,
  },
  button: {
    width: "100%",
    marginTop: 8,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#556B2F", 
    color: "#FFFFFF",
    fontWeight: 600,
  },
  link: {
    background: "transparent",
    border: "none",
    color: "#6B8E23", 
    cursor: "pointer",
    textDecoration: "underline",
  },
  error: {
    background: "#FFF1F1",
    border: "1px solid #F5C2C2",
    color: "#B00020",
    padding: "8px 10px",
    borderRadius: 8,
    margin: "10px 0",
    fontSize: 13,
  },
  eyeBtn: {
  position: "absolute",
  right: 10,
  top: "50%",                  
  transform: "translateY(-50%)", 
  background: "none",
  border: 0,
  cursor: "pointer",
  fontSize: 18,
  color: "#556B2F", 
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
};
