import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/**
 * Prix par catégorie
 * ⚠️ Pour les catégories avec plages de prix ou valeurs non numériques,
 * on utilise des chaînes de caractères pour éviter les erreurs de typage.
 */
export const CATEGORY_PRICES: Record<string, string | number> = {
  Basique: 2000,
  Bronze: 5000,
  Argent: 10000,
  Gold: 25000,
  Elite: 50000,
  Saphir: 100000,
  Premium: "200000 - 500000",
  Diamond: "500000 - 1000000",
  VVIP: ">= 2000000"
};

/**
 * Type pour les filtres de période
 */
export type PeriodFilter = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Interface pour les statistiques d'export
 */
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
  startDate: string;
  endDate: string;
}

export const printCard = (cardElement: HTMLElement) => {
  const printWindow = window.open('', '', 'height=600,width=800');
  if (!printWindow) return;
  
  printWindow.document.write('<html><head><title>Carte de Membre</title>');
  printWindow.document.write('</head><body>');
  printWindow.document.write(cardElement.outerHTML);
  printWindow.document.write('</body></html>');
  printWindow.document.close();
  printWindow.print();
};

export const downloadCard = async (cardElement: HTMLElement, membre: Membre) => {
  try {
    // Capturer l'élément comme canvas
    const canvas = await html2canvas(cardElement, {
      scale: 2,
      backgroundColor: '#ffffff',
      logging: false,
      useCORS: true,
      allowTaint: true
    });

    // Créer le PDF
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85, 54] // Format carte de crédit standard
    });

    // Ajouter l'image au PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 85, 54);
    
    // Télécharger le PDF
    pdf.save(`Carte_Membre_${membre.nom}_${membre.prenoms}.pdf`);
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    alert('Une erreur est survenue lors du téléchargement de la carte.');
  }
};

export const formatCardNumber = (number: number): string => {
  return String(number).padStart(4, '0');
};

export interface Membre {
  id: number;
  nom: string;
  prenoms: string;
  categorie: string;
  poste?: string;
  status?: string;
  photo_url?: string | null;
  created_at?: string;
  price: number;
  telephone?: string | null;
  email?: string | null;
  region?: string | null;
  ville?: string | null;
  lafonction?: string | null;

}

export interface User {
  id: string;
  email?: string;
}