import jsPDF from "jspdf";
import { Membre } from "./cardHelpers";
import { CATEGORY_PRICES, formatCurrency } from "./pricingConfig";

export type PeriodFilter = "day" | "week" | "month" | "year" | "custom";

export interface ExportStats {
  totalMembers: number;
  totalAmount: number;
  categoriesStats: {
    category: string;
    count: number;
    totalAmount: number;
  }[];
  regionsStats: {
    region: string;
    count: number;
  }[];
}

/** Filtrer les membres par période */
export const filterMembersByPeriod = (
  membres: Membre[],
  period: PeriodFilter,
  customStart?: Date,
  customEnd?: Date
): Membre[] => {
  const now = new Date();
  let startDate: Date;
  let endDate: Date = now;

  switch (period) {
    case "day":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case "week":
      const dayOfWeek = now.getDay();
      startDate = new Date(now.getTime() - dayOfWeek * 24 * 60 * 60 * 1000);
      startDate.setHours(0, 0, 0, 0);
      break;
    case "month":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      startDate = new Date(now.getFullYear(), 0, 1);
      break;
    case "custom":
      startDate = customStart || new Date(0);
      endDate = customEnd || now;
      break;
    default:
      startDate = new Date(0);
  }

  return membres.filter((membre) => {
    if (!membre.created_at) return false;
    const membreDate = new Date(membre.created_at);
    return membreDate >= startDate && membreDate <= endDate;
  });
};

/** Calculer les statistiques */
export const calculateStats = (membres: Membre[]): ExportStats => {
  const categoriesMap = new Map<string, { count: number; totalAmount: number }>();
  const regionsMap = new Map<string, number>();

  membres.forEach((membre) => {
    const category = membre.categorie;
    const basePrice = CATEGORY_PRICES[category];
    const price =
      typeof basePrice === "number" ? basePrice : membre.price ?? 0;

    // Catégories
    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, { count: 0, totalAmount: 0 });
    }
    const stats = categoriesMap.get(category)!;
    stats.count += 1;
    stats.totalAmount += price;

    // Régions
    if (membre.region) {
      regionsMap.set(membre.region, (regionsMap.get(membre.region) || 0) + 1);
    }
  });

  const categoriesStats = Array.from(categoriesMap.entries()).map(
    ([category, stats]) => ({
      category,
      count: stats.count,
      unitPrice:
        typeof CATEGORY_PRICES[category] === "number"
          ? (CATEGORY_PRICES[category] as number)
          : 0,
      totalAmount: stats.totalAmount,
    })
  );

  const regionsStats = Array.from(regionsMap.entries()).map(
    ([region, count]) => ({ region, count })
  );

  const totalAmount = categoriesStats.reduce(
    (sum, stat) => sum + stat.totalAmount,
    0
  );

  return {
    totalMembers: membres.length,
    totalAmount,
    categoriesStats,
    regionsStats,
  };
};

/** Export PDF */
/** Export PDF sans autotable */
export const exportRapportToPDF = (
  membres: Membre[],
  stats: ExportStats,
  period: string
) => {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(18);
  doc.text("RAPPORT DES MEMBRES", 105, 15, { align: "center" });

doc.setFontSize(12);

let periodLabel = period;
if (period === "month") {
  const mois = new Date().toLocaleString("fr-FR", { month: "long" });
  periodLabel = `Mois de ${mois}`;
}

doc.text(`Période: ${periodLabel}`, 105, 25, { align: "center" });

  // Statistiques globales
  doc.setFontSize(14);
  doc.text("Statistiques Globales", 14, 40);

  doc.setFontSize(11);
  doc.text(`Nombre total de membres: ${stats.totalMembers}`, 14, 50);
  doc.text(`Montant total: ${formatCurrency(stats.totalAmount)}`, 14, 57);

  let y = 70;

  // Tableau par catégorie
  doc.setFontSize(13);
  doc.text("Répartition par Catégorie", 14, y);
  y += 10;
  doc.setFontSize(11);
  doc.text("Catégorie", 14, y);
  doc.text("Nombre", 70, y);
  doc.text("Montant Total", 120, y);
  y += 8;
  stats.categoriesStats.forEach((c) => {
    doc.text(c.category, 14, y);
    doc.text(c.count.toString(), 70, y);
    doc.text(formatCurrency(c.totalAmount), 120, y);
    y += 8;
  });

  y += 10;

  // Tableau par région
  if (stats.regionsStats.length > 0) {
    doc.setFontSize(13);
    doc.text("Répartition par Région", 14, y);
    y += 10;
    doc.setFontSize(11);
    doc.text("Région", 14, y);
    doc.text("Nombre", 70, y);
    y += 8;
    stats.regionsStats.forEach((r) => {
      doc.text(r.region, 14, y);
      doc.text(r.count.toString(), 70, y);
      y += 8;
    });
  }

  y += 15;

  // Liste détaillée des membres
  doc.setFontSize(13);
  doc.text("Liste Détaillée des Membres", 14, y);
  y += 10;
  doc.setFontSize(11);

  // En-têtes
  doc.text("N°", 14, y);
  doc.text("Nom", 25, y);
  doc.text("Prénoms", 60, y);
  doc.text("Catégorie", 100, y);
  doc.text("Montant Contribué", 170, y);
  doc.text("Région", 125, y);
  doc.text("Ville", 150, y);
  doc.text("Téléphone", 170, y);
  y += 8;

  membres.forEach((m, index) => {

    doc.text((index + 1).toString(), 14, y);
    doc.text(m.nom, 25, y);
    doc.text(m.prenoms, 60, y);
    doc.text(m.categorie, 100, y);
    doc.text(m.price.toString(), 170, y);
    doc.text(m.region || "", 125, y);
    doc.text(m.ville || "", 150, y);
    doc.text(m.telephone || "", 170, y);

    y += 8;

    // Saut de page si trop bas
    if (y > 270) {
      doc.addPage();
      y = 20;
      doc.setFontSize(11);
    }
  });

  // Télécharger
  const filename = `Rapport_Membres_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};

/** Export CSV */
export const exportRapportToCSV = (membres: Membre[], stats: ExportStats) => {
  let csv = "\uFEFF"; // BOM pour UTF-8
  csv += "RAPPORT DES MEMBRES\n\n";

  // Statistiques globales
  csv += "STATISTIQUES GLOBALES\n";
  csv += `Nombre total de membres,${stats.totalMembers}\n`;
  csv += `Montant total,${stats.totalAmount} FCFA\n\n`;

  // Tableau par catégorie
  csv += "RÉPARTITION PAR CATÉGORIE\n";
  csv += "Catégorie,Nombre,Prix Unitaire,Montant Total\n";
  stats.categoriesStats.forEach((stat) => {
    csv += `${stat.category},${stat.count},${stat.totalAmount}\n`;
  });
  csv += "\n";

  // Tableau par région
  if (stats.regionsStats.length > 0) {
    csv += "RÉPARTITION PAR RÉGION\n";
    csv += "Région,Nombre\n";
    stats.regionsStats.forEach((r) => {
      csv += `${r.region},${r.count}\n`;
    });
    csv += "\n";
  }

  // Liste détaillée
  csv += "LISTE DÉTAILLÉE\n";
  csv += "N°,Nom,Prénoms,Catégorie,Région,Ville,Téléphone,Email,Date d'inscription,Montant\n";
  membres.forEach((membre, index) => {
    const date = new Date(membre.created_at || "").toLocaleDateString("fr-FR");
    const price =
      typeof CATEGORY_PRICES[membre.categorie] === "number"
        ? CATEGORY_PRICES[membre.categorie] as number
        : membre.price ?? 0;
    csv += `${index + 1},${membre.nom},${membre.prenoms},${membre.categorie},${membre.region || ""},${membre.ville || ""},${membre.telephone || ""},${membre.email || ""},${date},${price}\n`;
  });

  // Télécharger
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Rapport_Membres_${new Date().toISOString().split("T")[0]}.csv`
  );
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

