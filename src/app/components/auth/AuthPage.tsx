import { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { supabase } from "../../services/supabase";
import type { User as UserType } from "../../utils/cardHelpers";

interface AuthPageProps {
  onLogin: (user: UserType) => void;
}

export function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);

    if (!isLogin && password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onLogin(data.user);
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setIsLogin(true);
        setPassword("");
        setConfirmPassword("");
        alert("Compte créé avec succès ! Veuillez vous connecter.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ backgroundColor: "white", borderRadius: 16, padding: 40, maxWidth: 400, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ textAlign: "center", marginBottom: 30 }}>
          <div style={{ width: 80, height: 80, backgroundColor: "green", borderRadius: "50%", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={40} color="white" />
          </div>
          <h2 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>
            {isLogin ? "Connexion" : "Inscription"}
          </h2>
          <p style={{ margin: "10px 0 0", color: "#64748b" }}>
            {isLogin ? "Bienvenue sur l'application" : "Créez votre compte"}
          </p>
        </div>

        <div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#475569", fontSize: 14, fontWeight: 500 }}>
              <Mail size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#475569", fontSize: 14, fontWeight: 500 }}>
              <Lock size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
            />
          </div>

          {!isLogin && (
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", marginBottom: 8, color: "#475569", fontSize: 14, fontWeight: 500 }}>
                <Lock size={16} style={{ display: "inline", marginRight: 6, verticalAlign: "middle" }} />
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 16px", border: "2px solid #e2e8f0", borderRadius: 8, fontSize: 14, boxSizing: "border-box" }}
              />
            </div>
          )}

          {error && (
            <div style={{ marginBottom: 20, padding: 12, backgroundColor: "#fee", border: "1px solid #fcc", borderRadius: 8, color: "#c00", fontSize: 14 }}>
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "12px 16px", backgroundColor: "green", color: "white", border: "none", borderRadius: 8, fontSize: 16, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Chargement..." : isLogin ? "Se connecter" : "S'inscrire"}
          </button>
        </div>

        <div style={{ marginTop: 24, textAlign: "center" }}>
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{ background: "none", border: "none", color: "green", cursor: "pointer", fontSize: 14, textDecoration: "underline" }}
          >
            {isLogin ? "Pas de compte ? S'inscrire" : "Déjà un compte ? Se connecter"}
          </button>
        </div>
      </div>
    </div>
  );
}
