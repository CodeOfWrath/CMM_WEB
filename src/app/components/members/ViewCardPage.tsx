import React, { useRef } from "react";
import { Download, Printer } from "lucide-react";
import { MemberCard } from "../card/MemberCard";
import { printCard, downloadCard } from "../../utils/cardHelpers";
import type { Membre } from "../../utils/cardHelpers";

interface ViewCardPageProps {
  membre: Membre;
  cardNumber: number;
  onBack: () => void;
}

export function ViewCardPage({ membre, cardNumber, onBack }: ViewCardPageProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (cardRef.current) {
      downloadCard(cardRef.current, membre);
    }
  };

  const handlePrint = () => {
    if (cardRef.current) {
      printCard(cardRef.current);
    }
  };

  const buttonStyle: React.CSSProperties = {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    fontSize: 14,
    fontWeight: 500,
    display: "flex",
    alignItems: "center",
    gap: 8,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: 20 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 20,
            marginBottom: 20,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>
              Carte de {membre.nom} {membre.prenoms}
            </h1>
            <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 14 }}>
              N°{String(cardNumber).padStart(4, "0")}
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleDownload}
              style={{ ...buttonStyle, backgroundColor: "green" }}
              aria-label="Télécharger la carte"
              title="Télécharger la carte"
            >
              <Download size={18} />
              Télécharger
            </button>
            <button
              onClick={handlePrint}
              style={{ ...buttonStyle, backgroundColor: "#3b82f6" }}
              aria-label="Imprimer la carte"
              title="Imprimer la carte"
            >
              <Printer size={18} />
              Imprimer
            </button>
            <button
              onClick={onBack}
              style={{ ...buttonStyle, backgroundColor: "#64748b" }}
              aria-label="Retour"
              title="Retour"
            >
              Retour
            </button>
          </div>
        </div>

        {/* Aperçu de la carte */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 40,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div ref={cardRef}>
            <MemberCard
              imageFile={null}
              photo_url={membre.photo_url}
              nom={membre.nom}
              prenoms={membre.prenoms}
              categorie={membre.categorie}
              nb={cardNumber}
              supabaseId={String(membre.id)}
              lafonction={membre.lafonction}
            />
          </div>
        </div>
      </div>
    </div>
  );
}