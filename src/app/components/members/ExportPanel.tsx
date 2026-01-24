import { useEffect, useState } from "react";
import { Membre, PeriodFilter, ExportStats, CATEGORY_PRICES } from "@/app/utils/cardHelpers";
/*import jsPDF from "jspdf";*/
import { exportRapportToCSV, exportRapportToPDF } from "@/app/utils/exportHelper";

interface ExportPanelProps {
  membres: Membre[];
}

/** Filtrer les membres selon la période */
function filterByPeriod(membres: Membre[], period: PeriodFilter): Membre[] {
  const now = new Date();
  return membres.filter(m => {
    if (!m.created_at) return false;
    const created = new Date(m.created_at);

    switch (period) {
      case "day":
        return created.toDateString() === now.toDateString();
      case "week": {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        return created >= startOfWeek;
      }
      case "month":
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      case "year":
        return created.getFullYear() === now.getFullYear();
      case "all":
      default:
        return true;
    }
  });
}

/** Calculer les statistiques */
function computeStats(membres: Membre[], startDate: string, endDate: string): ExportStats {
  const categoriesStats: { category: string; count: number; unitPrice: number; totalAmount: number }[] = [];
  const regionsStats: { region: string; count: number }[] = [];
  let totalAmount = 0;

  Object.keys(CATEGORY_PRICES).forEach(cat => {
    const membersInCat = membres.filter(m => m.categorie === cat);
    const count = membersInCat.length;

    let amount = 0;
    if (typeof CATEGORY_PRICES[cat] === "number") {
      const price = CATEGORY_PRICES[cat] as number;
      amount = count * price;
    } else {
      amount = membersInCat.reduce((sum, m) => sum + (m.price ?? 0), 0);
    }

    totalAmount += amount;
    categoriesStats.push({ category: cat, count, unitPrice: typeof CATEGORY_PRICES[cat] === "number" ? CATEGORY_PRICES[cat] as number : 0, totalAmount: amount });
  });

  // Statistiques par région
  const regions = Array.from(new Set(membres.map(m => m.region).filter(Boolean)));
  regions.forEach(region => {
    const membersInRegion = membres.filter(m => m.region === region);
    regionsStats.push({ region: region!, count: membersInRegion.length });
  });

  return {
    totalMembers: membres.length,
    totalAmount,
    categoriesStats,
    regionsStats,
    startDate,
    endDate,
  };
}

/** Composant principal */
export function ExportPanel({ membres }: ExportPanelProps) {
  const [period, setPeriod] = useState<PeriodFilter>("month");
  const [, setFilteredMembers] = useState<Membre[]>([]);
  const [stats, setStats] = useState<ExportStats | null>(null);

  useEffect(() => {
    const fm = filterByPeriod(membres, period);
    setFilteredMembers(fm);

    const now = new Date();
    const startDate = fm.length > 0 ? fm[0].created_at ?? "" : "";
    const endDate = now.toISOString();

    setStats(computeStats(fm, startDate, endDate));
  }, [period, membres]);

  /** Export CSV */
  /*const exportCSV = () => {
    if (!stats) return;
    const rows = [
      ["Catégorie", "Nombre", "Prix Unitaire", "Montant Total"],
      ...stats.categoriesStats.map(c => [c.category, c.count.toString(), c.totalAmount.toString()]),
      ["Total", stats.totalMembers.toString(), "", stats.totalAmount.toString()],
      [],
      ["Région", "Nombre"],
      ...stats.regionsStats.map(r => [r.region, r.count.toString()]),
    ];

    const csvContent = rows.map(r => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "export_membres.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };*/

  /** Export PDF */
  /*const exportPDF = () => {
    if (!stats) return;
    const pdf = new jsPDF();
    pdf.text("Statistiques des Membres", 10, 10);

    let y = 20;
    pdf.text("Par Catégorie:", 10, y);
    y += 10;
    stats.categoriesStats.forEach(c => {
      pdf.text(`${c.category}: ${c.count} membres - ${c.totalAmount} FCFA`, 10, y);
      y += 10;
    });

    y += 10;
    pdf.text(`Total Membres: ${stats.totalMembers}`, 10, y);
    pdf.text(`Montant Total: ${stats.totalAmount} FCFA`, 10, y + 10);

    y += 30;
    pdf.text("Par Région:", 10, y);
    y += 10;
    stats.regionsStats.forEach(r => {
      pdf.text(`${r.region}: ${r.count} membres`, 10, y);
      y += 10;
    });

    pdf.save("export_membres.pdf");
  };*/

  return (
    <div className="export-panel">
      <h2>Export des Membres</h2>

      {/* Sélecteur de période */}
      <div>
        <label>Période: </label>
        <select value={period} onChange={e => setPeriod(e.target.value as PeriodFilter)}>
          <option value="day">Aujourd'hui</option>
          <option value="week">Cette semaine</option>
          <option value="month">Ce mois</option>
          <option value="year">Cette année</option>
          <option value="all">Tout</option>
        </select>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="stats">
          <p>Total Membres: {stats.totalMembers}</p>
          <p>Montant Total: {stats.totalAmount} FCFA</p>
        </div>
      )}

      {/* Tableau par catégorie */}
      {stats && (
        <table>
          <thead>
            <tr>
              <th>Catégorie</th>
              <th>Nombre</th>
              <th>Prix Unitaire</th>
              <th>Montant Total</th>
            </tr>
          </thead>
          <tbody>
            {stats.categoriesStats.map(c => (
              <tr key={c.category}>
                <td>{c.category}</td>
                <td>{c.count}</td>
                <td>{c.totalAmount} FCFA</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Tableau par région */}
      {stats && stats.regionsStats.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Région</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {stats.regionsStats.map(r => (
              <tr key={r.region}>
                <td>{r.region}</td>
                <td>{r.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Boutons d'export */}
      <div className="flex gap-3 mt-5">
        {/*<button
          onClick={exportCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center gap-2 transition"
        >
          📄 Exporter en CSV
        </button>
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md font-medium flex items-center gap-2 transition"
        >
          🖨️ Exporter en PDF
        </button>*/}
        <button
          onClick={()=>exportRapportToCSV(membres, stats!)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center gap-2 transition"
        >
          📄 rapport complet en csv
        </button>
        <button
          onClick={()=>exportRapportToPDF(membres, stats!, period)}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center gap-2 transition"
        >
          🖨️ rapport complet en pdf
        </button>
      </div>
    </div>
  );
}