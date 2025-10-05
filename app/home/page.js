"use client";

import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (userDetails) => {
      if (!userDetails) {
        router.replace("/");
      } else {
        setName(userDetails.displayName || "there");
      }
    });
    return () => unsub();
  }, [router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/");
  };

  return (
    <main style={styles.container}>
      <div style={styles.card}>
        <h1>Hello, {name}!</h1>
        <p>You are successfully logged in.</p>
        <button onClick={handleLogout} style={styles.button}>Logout</button>
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
    background: "#FAF9F6", 
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 520,
    background: "#FFFFFF",
    border: "1px solid #E5E5E5",
    borderRadius: 16,
    padding: 28,
    textAlign: "center",
    color: "#1F1F1F",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
  button: {
    marginTop: 16,
    padding: "10px 14px",
    borderRadius: 8,
    border: "none",
    cursor: "pointer",
    background: "#556B2F",
    color: "#FFFFFF",
    fontWeight: 600,
  },
};

