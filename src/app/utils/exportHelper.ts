import jsPDF from "jspdf";
import autoTable from 'jspdf-autotable';
import { Membre } from "./cardHelpers";
import { CATEGORY_PRICES, formatCurrency } from "./pricingConfig";

export type PeriodFilter = "day" | "week" | "month" | "year" | "custom";

export interface ExportStats {
  totalMembers: number;
  totalAmount: number;
  categoriesStats: {
    category: string;
    count: number;
    unitPrice: number;
    totalAmount: number;
  }[];
}

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

export const calculateStats = (membres: Membre[]): ExportStats => {
  const categoriesMap = new Map<string, { count: number; totalAmount: number }>();

  membres.forEach((membre) => {
    const category = membre.categorie;
    const price = CATEGORY_PRICES[category] || 0;

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, { count: 0, totalAmount: 0 });
    }

    const stats = categoriesMap.get(category)!;
    stats.count += 1;
    stats.totalAmount += price;
  });

  const categoriesStats = Array.from(categoriesMap.entries()).map(
    ([category, stats]) => ({
      category,
      count: stats.count,
      unitPrice: CATEGORY_PRICES[category] || 0,
      totalAmount: stats.totalAmount,
    })
  );

  const totalAmount = categoriesStats.reduce(
    (sum, stat) => sum + stat.totalAmount,
    0
  );

  return {
    totalMembers: membres.length,
    totalAmount,
    categoriesStats,
  };
};

export const exportToPDF = (
  membres: Membre[],
  stats: ExportStats,
  period: string
) => {
  const doc = new jsPDF();

  // Titre
  doc.setFontSize(18);
  doc.text("RAPPORT DES MEMBRES", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Période: ${period}`, 105, 25, { align: "center" });

  // Statistiques globales
  doc.setFontSize(14);
  doc.text("Statistiques Globales", 14, 40);

  doc.setFontSize(11);
  doc.text(`Nombre total de membres: ${stats.totalMembers}`, 14, 50);
  doc.text(`Montant total: ${formatCurrency(stats.totalAmount)}`, 14, 57);

  // Tableau par catégorie
  const tableData = stats.categoriesStats.map((stat) => [
    stat.category,
    stat.count.toString(),
    formatCurrency(stat.unitPrice),
    formatCurrency(stat.totalAmount),
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Catégorie", "Nombre", "Prix Unitaire", "Montant Total"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [0, 128, 0] },
  });

  // Liste détaillée
  const detailData = membres.map((membre, index) => [
    (index + 1).toString(),
    `${membre.nom} ${membre.prenoms}`,
    membre.categorie,
    new Date(membre.created_at || "").toLocaleDateString("fr-FR"),
    formatCurrency(CATEGORY_PRICES[membre.categorie] || 0),
  ]);

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 15,
    head: [["N°", "Nom Complet", "Catégorie", "Date", "Montant"]],
    body: detailData,
    theme: "striped",
    headStyles: { fillColor: [0, 128, 0] },
  });

  // Télécharger
  const filename = `Rapport_Membres_${new Date().toISOString().split("T")[0]}.pdf`;
  doc.save(filename);
};

export const exportToCSV = (membres: Membre[], stats: ExportStats) => {
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
    csv += `${stat.category},${stat.count},${stat.unitPrice},${stat.totalAmount}\n`;
  });

  csv += "\n";

  // Liste détaillée
  csv += "LISTE DÉTAILLÉE\n";
  csv += "N°,Nom,Prénoms,Catégorie,Date d'inscription,Montant\n";
  membres.forEach((membre, index) => {
    const date = new Date(membre.created_at || "").toLocaleDateString("fr-FR");
    const price = CATEGORY_PRICES[membre.categorie] || 0;
    csv += `${index + 1},${membre.nom},${membre.prenoms},${membre.categorie},${date},${price}\n`;
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
