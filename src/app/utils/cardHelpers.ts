import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  photo_url?: string;
  created_at?: string;
}

export interface User {
  id: string;
  email?: string;
}