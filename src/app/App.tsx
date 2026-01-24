import React, { useState, useEffect } from "react";
import { AuthPage } from "./components/auth/AuthPage";
import { NewCardPage } from "./components/members/NewCardPage";
import { supabase } from "./services/supabase";
import type { User } from "./utils/cardHelpers";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
    setLoading(false);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f1f5f9" }}>
        <div style={{ fontSize: 20, color: "#64748b" }}>Chargement...</div>
      </div>
    );
  }

  return user ? (
    <NewCardPage user={user} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  );
}
