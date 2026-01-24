import { useState, useEffect } from "react";
import { Search, Users, Eye } from "lucide-react";
import type { Membre } from "../../utils/cardHelpers";
import { supabase } from "../../services/supabase";

interface MembersListProps {
  onViewCard: (membre: Membre, cardNum: number) => void;
  onBack: () => void;
}

export function MembersList({ onViewCard, onBack }: MembersListProps) {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMembres();
  }, []);

  const loadMembres = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erreur chargement membres:", error);
      setMembres([]);
    } else {
      setMembres(data || []);
    }
    setLoading(false);
  };

  const filteredMembres = membres.filter(
    (m) =>
      m.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.prenoms.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toString().includes(searchTerm)
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <div>
              <h1 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>
                Liste des Membres
              </h1>
              <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 14 }}>
                {membres.length} membre(s) enregistré(s)
              </p>
            </div>
            <button
              onClick={onBack}
              style={{
                padding: "10px 20px",
                backgroundColor: "#64748b",
                color: "white",
                border: "none",
                borderRadius: 8,
                cursor: "pointer",
                fontSize: 14,
                fontWeight: 500,
              }}
            >
              Retour
            </button>
          </div>

          {/* Search */}
          <div style={{ position: "relative" }}>
            <Search
              size={20}
              style={{
                position: "absolute",
                left: 12,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#94a3b8",
              }}
            />
            <input
              type="text"
              placeholder="Rechercher par nom, prénom ou numéro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "12px 12px 12px 40px",
                border: "2px solid #e2e8f0",
                borderRadius: 8,
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40, color: "#64748b" }}>
            Chargement...
          </div>
        ) : filteredMembres.length === 0 ? (
          <div
            style={{
              backgroundColor: "white",
              borderRadius: 12,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          >
            <Users
              size={64}
              color="#cbd5e1"
              style={{ margin: "0 auto 20px", display: "block" }}
            />
            <p style={{ color: "#64748b" }}>Aucun membre trouvé</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 20,
            }}
          >
            {filteredMembres.map((membre, index) => (
              <div
                key={membre.id}
                style={{
                  backgroundColor: "white",
                  borderRadius: 12,
                  padding: 20,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", marginBottom: 15 }}>
                  <div
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: "50%",
                      backgroundColor: "#e2e8f0",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 15,
                    }}
                  >
                    <Users size={30} color="#64748b" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: 0, fontSize: 16, color: "#0f172a" }}>
                      {membre.nom} {membre.prenoms}
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
                      N°{String(filteredMembres.length - index).padStart(4, "0")}
                    </p>
                  </div>
                </div>
                <div style={{ marginBottom: 15 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 14, color: "#475569" }}>
                    <strong>Catégorie:</strong> {membre.categorie}
                  </p>
                  {/*<p style={{ margin: 0, fontSize: 14, color: "#475569" }}>
                    <strong>ID:</strong> {membre.id}
                  </p>*/}
                </div>
                <button
                  onClick={() => onViewCard(membre, filteredMembres.length - index)}
                  style={{
                    width: "100%",
                    padding: "10px",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer",
                    fontSize: 14,
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                  }}
                >
                  <Eye size={18} />
                  Voir la carte
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}