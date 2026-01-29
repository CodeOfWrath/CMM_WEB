import { useMemo } from "react";
import { User } from "lucide-react";
import { QRCode } from "./QRCode";

//import backgroundImg from "/assets/2b5777bd9513bf7d4bf5912722a6e6a301a4742e.png";
//import logoFecafoot from "@/assets/f8b487365d6ff184ceb226c3c313ef26e4a6170c.png";
//import logoClub from "@/assets/51ce17fe899d3aa6bdf973ae40de394787f2971f.png";

interface MemberCardProps {
  imageFile?: File | null | undefined;
  nom: string;
  prenoms: string;
  categorie: string;
  nb: number;
  supabaseId?: string | null;
  photo_url?: string | null;
  lafonction?: string | null;
}

export function MemberCard({
  imageFile,
  nom,
  prenoms,
  categorie,
  nb,
  supabaseId,
  photo_url,
  lafonction,
}: MemberCardProps) {
  // ⚡️ Génère une URL stable pour l’image uploadée
  const fileUrl = useMemo(
    () => (imageFile ? URL.createObjectURL(imageFile) : null),
    [imageFile]
  );

  return (
    <div
      style={{
        height: 300,
        width: 450,
        position: "relative",
        overflow: "hidden",
        backgroundColor: "green",
      }}
    >

      {/* Background image */}
      <img
        src="/assets/2b5777bd9513bf7d4bf5912722a6e6a301a4742e.png"
        alt="Fond graphique"
        style={{
          width: 450,
          objectFit: "cover",
          position: "absolute",
          bottom: "-15%",
          left: 0,
        }}
      />

      {/* Bordure */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: "4px solid rgba(1, 75, 57, 1)",
        }}
      />

      {/* Logo club */}
      <img
        src="/assets/51ce17fe899d3aa6bdf973ae40de394787f2971f.png"
        alt="Logo du club"
        style={{
          position: "absolute",
          top: 10,
          left: 8,
          height: 72,
          objectFit: "cover",
        }}
      />

      {/* Logo FECAFOOT */}
      <img
        src="/assets/f8b487365d6ff184ceb226c3c313ef26e4a6170c.png"
        alt="Logo FECAFOOT"
        style={{
          position: "absolute",
          top: 10,
          right: 15,
          height: 65,
          objectFit: "cover",
        }}
      />

      {/* Texte principal en haut */}
      <div
        style={{
          position: "absolute",
          top: 25,
          right: 10,
          left: 20,
          color: "white",
          fontSize: 12.5,
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: 1.2,
        }}
      >
        FEDERATION CAMEROUNAISE DE FOOTBALL<br />
        MTN ELITE ONE<br />
        PANTHERE SPORTIVE DU NDE NZUIMANTO S.A
      </div>

      {/* Bandeau "CARTE DE MEMBRE" en bas */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 90,
          right: 90,
          height: 40,
          backgroundColor: "rgba(1, 75, 57, 1)",
          borderRadius: "10px 10px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          paddingTop: 0,
        }}
      >
        <div style={{ fontSize: 15, color: "white", textAlign: "center" }}>
          CARTE DE MEMBRE PSNSA2026{nb}
        </div>
      </div>

      {/* Bandeau blanc derrière le texte */}
      <div
        style={{
          position: "absolute",
          top: 98,
          left: 180,
          height: 60,
          width: 210,
          backgroundColor: "rgba(255, 255, 255, 0.6)",
          borderRadius: 22,
        }}
      />

      {/* Photo du membre */}
      <div
        style={{
          position: "absolute",
          top: 85,
          left: 45,
          height: 120,
          width: 160,
          backgroundColor: "rgba(1, 75, 57, 1)",
          border: "4px solid rgba(1, 75, 57, 1)",
          borderRadius: 15,
          overflow: "hidden",
        }}
      >
        {fileUrl ? (
          <img
            src={fileUrl}
            alt="Photo du membre"
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : photo_url ? (
          <img
            src={photo_url}
            alt="Photo du membre "
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <User size={60} color="#999" />
          </div>
        )}
      </div>

      {/* Saison sportive */}
      <div
        style={{
          position: "absolute",
          top: 80,
          right: 90,
          color: "white",
          fontSize: 11,
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: 1,
        }}
      >
        Saison Sportive 2025-2026
      </div>

      {/* Nom et catégorie */}
 <div
  style={{
    position: "absolute",
    top: 98,
    left: 195,
    right: 60,
    color: "black",
    textAlign: "center",
    lineHeight: 0.8,
  }}
>
  <span style={{ fontSize: 17, fontWeight: "bold" }}>
    {nom} {prenoms}
  </span>
  <br />
  <br />
  <span style={{ fontSize: 12, fontWeight: "bold" }}>
    {categorie}
  </span>
  <br />
  <span style={{ fontSize: 12, fontWeight: "bold" }}>
    {lafonction}
  </span>
</div>

      {/* QR Code en bas à gauche */}
     <div
  style={{
    position: "absolute",
    bottom: 40,
    left: 10,
    width: 80,              // largeur de la carte blanche
    height: 80,             // hauteur de la carte blanche
    backgroundColor: "white",
    borderRadius: 10,
    display: "flex",         // pour centrer le QR code
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)", // petit effet carte
  }}
>
  {supabaseId ? (
    <QRCode value={supabaseId} size={65} />
  ) : (
    <div style={{ width: 65, height: 65, backgroundColor: "#eee" }} />
  )}
</div>
    </div>
  );
}