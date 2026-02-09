import React, { useState, useRef, useEffect } from "react";
import { LogOut, Users, Plus, X, User } from "lucide-react";
import { MemberCard } from "../card/MemberCard";
import { MembersList } from "./MembersList";
import { ViewCardPage } from "./ViewCardPage";
import { membresService, rpcService, storageService } from "../../services/supabase";
import type { User as UserType, Membre } from "../../utils/cardHelpers";
import { EditCardForm } from "./EditCardForm";

interface NewCardPageProps {
  user: UserType;
  onLogout: () => void;
}

export function NewCardPage({ user, onLogout }: NewCardPageProps) {
  const [view, setView] = useState<"create" | "list" | "view">("create");
  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null);
  const [selectedCardNumber, setSelectedCardNumber] = useState<number | null>(null);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [nom, setNom] = useState("");
  const [prenoms, setPrenoms] = useState("");
  const [categorie, setCategorie] = useState("");
  const [price, setPrice] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [region, setRegion] = useState("");
  const [ville, setVille] = useState("");
  const [lafonction, setLafonction] = useState("");
  const [supabaseId, setSupabaseId] = useState<string | null>(null);
  const [nbCarte, setNbCarte] = useState(0);
  const [showExport, setShowExport] = useState(false); // ✅ nouvel état

  const cardRef = useRef<HTMLDivElement>(null);
  const [editing, setEditing] = useState(false);

  const pickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };

  const getMembersCount = async () => {
    const { data, error } = await rpcService.getMembersCount();
    if (!error && typeof data === "number") setNbCarte(data);
  };

const submitForm = async () => {
  if (!nom || !prenoms || !categorie) {
    alert("Veuillez remplir tous les champs obligatoires");
    return;
  }

  let photo_url: string | null = null;

  if (imageFile) {
    const filePath = `membres/${Date.now()}-${imageFile.name}`;
    try {
      photo_url = await storageService.uploadImage("membres", filePath, imageFile);
    } catch (err) {
      console.error("Erreur upload image:", err);
      alert("Impossible d'uploader l'image");
      return;
    }
  }

  // Préparer l'objet à insérer
  const payload = {
    nom,
    prenoms,
    categorie,
    poste: "RAS",
    status: "Membre",
    photo_url,
    created_at: new Date().toISOString(),
    // Champs optionnels
    telephone: telephone || null,
    email: email || null,
    region: region || null,
    ville: ville || null,
    lafonction: lafonction || null,
    // Prix : seulement si Premium/Diamond/VVIP
    price: ["Premium", "Diamond", "VVIP"].includes(categorie) ? Number(price) : undefined,
  };

  const { data, error } = await membresService.insert(payload);

  if (error || !data) {
    console.error(error);
    alert("Erreur lors de l'enregistrement");
    return;
  }

  const docId = String(data.id);
  setSupabaseId(docId);

  alert(`Carte enregistrée avec ID: ${docId}`);
  await getMembersCount();
};

  const resetForm = () => {
    setImageFile(null);
    setNom("");
    setPrenoms("");
    setCategorie("");
    setSupabaseId(null);
  };

  useEffect(() => {
    getMembersCount();
  }, []);

  if (view === "list") {
    return (
      <MembersList
        onViewCard={(membre, cardNum) => {
          setSelectedMembre(membre);
          setSelectedCardNumber(cardNum);
          setView("view");
        }}
        onBack={() => {
          setView("create");
          setShowExport(false);
        }}
        defaultExport={showExport} // ✅ ouverture automatique du panel export
      />
    );
  }

  if (view === "view" && selectedMembre && selectedCardNumber) {
    return (
    <>
      {editing ? (
        <EditCardForm
          membre={selectedMembre}
          onSave={(updated) => {
            setSelectedMembre(updated);
            console.log("Membre modifié :", updated);
            setEditing(false);
          }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ViewCardPage
          membre={selectedMembre}
          cardNumber={selectedCardNumber}
          onBack={() => { setView("list"); setSelectedMembre(null); } } 
          onEdit={() => setEditing(true)}
        />
      )}
    </>
  );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f1f5f9", padding: 20 }}>
      {/* Header */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backgroundColor: "white",
          borderRadius: 12,
          padding: 20,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 24, color: "#0f172a" }}>
            Gestion des Cartes de Membres
          </h1>
          <p style={{ margin: "5px 0 0", color: "#64748b", fontSize: 14 }}>
            Connecté en tant que {user.email}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              setView("list");
              setShowExport(false);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              backgroundColor: "green",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <Users size={18} />
            Liste des membres
          </button>

          {/* ✅ Bouton Exporter les rapports */}
          <button
            onClick={() => {
              setView("list");
              setShowExport(true);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              backgroundColor: "#0f172a",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            📊 Exporter les rapports
          </button>

          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 20px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontSize: 14,
              fontWeight: 500,
            }}
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Formulaire + Aperçu */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 20,
        }}
      >
        {/* Formulaire */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 30,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2
            style={{
              margin: "0 0 20px",
              fontSize: 20,
              color: "#0f172a",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Plus size={24} /> Nouvelle Carte
          </h2>

          {/* Upload image */}
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 8, color: "#475569", fontSize: 14, fontWeight: 500 }}>
              Photo du membre
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={pickImage}
              style={{
                width: "100%",
                padding: "10px",
                border: "2px dashed #cbd5e1",
                borderRadius: 8,
                cursor: "pointer",
              }}
            />
            {imageFile && (
              <div style={{ marginTop: 10, textAlign: "center" }}>
                <img
                  src={URL.createObjectURL(imageFile)}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid green",
                  }}
                />
              </div>
            )}
          </div>

       {/* Civilité + Nom */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Civilité et Nom
  </label>

  <div style={{ display: "flex", gap: 10 }}>
    {/* Select Civilité */}
    <select
      onChange={(e) => {
        const civ = e.target.value;
        // On remplace la civilité au début du nom
        const parts = nom.split(" ");
        const currentName = parts.slice(1).join(" "); // enlève l’ancienne civilité
        setNom(`${civ} ${currentName}`.trim());
      }}
      style={{
        padding: "12px 16px",
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        fontSize: 15,
        boxSizing: "border-box",
      }}
    >
      <option value="">-- Civilité --</option>
      <option value="M.">M.</option>
      <option value="Mme">Mme</option>
      <option value="Mlle">Mlle</option>
      <option value="Me">Me</option>
      <option value="Pr">Pr</option>
      <option value="Dr">Dr</option>
      <option value="Rm">Rm</option>
    </select>

    {/* Champ Nom */}
    <input
      placeholder="Nom de famille"
      value={nom.split(" ").slice(1).join(" ")} // affiche uniquement le nom sans la civilité
      onChange={(e) => {
        const civ = nom.split(" ")[0] || "";
        setNom(`${civ} ${e.target.value}`.trim());
      }}
      style={{
        flex: 1,
        padding: "12px 16px",
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        fontSize: 15,
        boxSizing: "border-box",
      }}
    />
  </div>
</div>

{/* Prénoms */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Prénoms
  </label>
  <input
    placeholder="Prénom(s)"
    value={prenoms}
    onChange={(e) => setPrenoms(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 18,
      boxSizing: "border-box",
    }}
  />
</div>

{/* Catégorie */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Catégorie
  </label>
  <select
    value={categorie}
    onChange={(e) => setCategorie(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  >
    <option value="">Sélectionner une catégorie</option>
    <option value="Basique">Basique</option>
    <option value="Bronze">Bronze</option>
    <option value="Argent">Argent</option>
    <option value="Gold">Gold</option>
    <option value="Elite">Elite</option>
    <option value="Saphir">Saphir</option>
    <option value="Premium">Premium</option>
    <option value="Diamond">Diamond</option>
    <option value="VVIP">VVIP</option>
  </select>
</div>

{/* Champ price si Premium, Diamond ou VVIP */}
{["Premium", "Diamond", "VVIP"].includes(categorie) && (
  <div style={{ marginBottom: 20 }}>
    <label
      style={{
        display: "block",
        marginBottom: 8,
        color: "#475569",
        fontSize: 14,
        fontWeight: 500,
      }}
    >
      Montant (price)
    </label>
    <input
      type="number"
      value={price}
      onChange={(e) => setPrice(e.target.value)}
      placeholder="Entrez la somme"
      style={{
        width: "100%",
        padding: "12px 16px",
        border: "2px solid #e2e8f0",
        borderRadius: 8,
        fontSize: 14,
        boxSizing: "border-box",
      }}
    />
  </div>
)}

{/* Numéro de téléphone (optionnel) */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Numéro de téléphone (optionnel)
  </label>
  <input
    type="tel"
    placeholder="Ex: +237 699 00 00 00"
    value={telephone}
    onChange={(e) => setTelephone(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  />
</div>

{/* Adresse mail (optionnel) */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Adresse mail (optionnel)
  </label>
  <input
    type="email"
    placeholder="exemple@mail.com"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  />
</div>

{/* Région */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Région
  </label>
  <select
    value={region}
    onChange={(e) => setRegion(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  >
    <option value="">Sélectionner une région</option>
    <option value="Adamaoua">Adamaoua</option>
    <option value="Centre">Centre</option>
    <option value="Est">Est</option>
    <option value="Extrême-Nord">Extrême-Nord</option>
    <option value="Littoral">Littoral</option>
    <option value="Nord">Nord</option>
    <option value="Nord-Ouest">Nord-Ouest</option>
    <option value="Ouest">Ouest</option>
    <option value="Sud">Sud</option>
    <option value="Sud-Ouest">Sud-Ouest</option>
  </select>
</div>

{/* Ville */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Ville
  </label>
  <input
    type="text"
    placeholder="Entrez la ville"
    value={ville}
    onChange={(e) => setVille(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  />
</div>

{/* Fonction */}
<div style={{ marginBottom: 20 }}>
  <label
    style={{
      display: "block",
      marginBottom: 8,
      color: "#475569",
      fontSize: 14,
      fontWeight: 500,
    }}
  >
    Fonction
  </label>
  <input
    type="text"
    placeholder="Entrez la fonctionnalité"
    value={lafonction}
    onChange={(e) => setLafonction(e.target.value)}
    style={{
      width: "100%",
      padding: "12px 16px",
      border: "2px solid #e2e8f0",
      borderRadius: 8,
      fontSize: 14,
      boxSizing: "border-box",
    }}
  />
</div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={submitForm}
              style={{
                flex: 1,
                padding: "14px 24px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Créer la carte
            </button>
            <button
              onClick={resetForm}
              style={{
                padding: "14px 24px",
                backgroundColor: "#e2e8f0",
                color: "#475569",
                border: "none",
                borderRadius: 8,
                fontSize: 16,
                fontWeight: 600,
                cursor: "pointer",
              }}
              aria-label="Réinitialiser le formulaire"
              title="Réinitialiser le formulaire"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Aperçu */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: 12,
            padding: 30,
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ margin: "0 0 20px", fontSize: 20, color: "#0f172a" }}>
            Aperçu de la carte
          </h2>
          <div
            ref={cardRef}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 300,
            }}
          >
            {nom || prenoms || categorie || imageFile ? (
              <MemberCard
                imageFile={imageFile}
                nom={nom}
                prenoms={prenoms}
                categorie={categorie}
                nb={nbCarte + 1}
                supabaseId={supabaseId}
                lafonction={lafonction}
              />
            ) : (
              <div style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>
                <User size={64} style={{ margin: "0 auto 20px", display: "block" }} />
                <p>Remplissez le formulaire pour voir l'aperçu de la carte</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}