import React, { useState } from "react";
import type { Membre } from "../../utils/cardHelpers";
import { membresService, storageService } from "../../services/supabase";

interface EditCardFormProps {
  membre: Membre;
  onSave: (updated: Membre) => void;
  onCancel: () => void;
}

export function EditCardForm({ membre, onSave, onCancel }: EditCardFormProps) {
  const [formData, setFormData] = useState<Membre>({ ...membre });
  const [newFile, setNewFile] = useState<File | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let photo_url = formData.photo_url;

    if (newFile) {
      const filePath = `membres/${Date.now()}-${newFile.name}`;
      try {
        photo_url = await storageService.uploadImage("membres", filePath, newFile);
      } catch (err) {
        console.error("Erreur upload image:", err);
        alert("Impossible d'uploader l'image");
        return;
      }
    }

    try {
      const { data, error } = await membresService.update(String(membre.id), {
        ...formData,
        photo_url,
      });

      if (error) {
        console.error(error);
        alert("Erreur lors de la mise à jour");
        return;
      }

      alert("Membre mis à jour avec succès !");
      onSave(data);
    } catch (err) {
      console.error(err);
      alert("Erreur inattendue");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 12,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        maxWidth: 600,
        margin: "0 auto",
      }}
    >
      <h2 style={{ marginBottom: 20 }}>Modifier la carte</h2>

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
        value={formData.nom.split(" ")[0] || ""}
        onChange={(e) => {
            const civ = e.target.value;
            const currentName = formData.nom.split(" ").slice(1).join(" ");
            setFormData((prev) => ({ ...prev, nom: civ ? `${civ} ${currentName}`.trim() : currentName }));
        }}
        style={{
            padding: "12px 16px",
            border: "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 15,
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
        value={formData.nom.split(" ").slice(1).join(" ") || formData.nom}
        onChange={(e) => {
            const civ = formData.nom.split(" ")[0] || "";
            const newName = e.target.value;
            setFormData((prev) => ({
            ...prev,
            nom: civ ? `${civ} ${newName}`.trim() : newName,
            }));
        }}
        style={{
            flex: 1,
            padding: "12px 16px",
            border: "2px solid #e2e8f0",
            borderRadius: 8,
            fontSize: 15,
        }}
        />
    </div>
    </div>

      <label>
        Prénoms :
        <input
          type="text"
          name="prenoms"
          value={formData.prenoms}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>

      <label>
        Fonction :
        <input
          type="text"
          name="lafonction"
          value={formData.lafonction || ""}
          onChange={handleChange}
          style={{ width: "100%", marginBottom: 10 }}
        />
      </label>

      <label>
        Photo :
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        <button
          type="submit"
          style={{
            backgroundColor: "green",
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
          }}
        >
          Sauvegarder
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            backgroundColor: "#64748b",
            color: "white",
            padding: "10px 20px",
            borderRadius: 8,
          }}
        >
          Annuler
        </button>
      </div>
    </form>
  );
}