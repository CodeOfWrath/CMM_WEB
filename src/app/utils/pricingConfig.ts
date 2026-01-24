export interface CategoryPrice {
  name: string;
  price: number;
}

export const CATEGORY_PRICES: Record<string, number> = {
  "Joueur": 50000,
  "Staff Technique": 30000,
  "Direction": 100000,
  "Administratif": 40000,
  "Médical": 60000,
};

export const CATEGORIES: CategoryPrice[] = [
  { name: "Joueur", price: 50000 },
  { name: "Staff Technique", price: 30000 },
  { name: "Direction", price: 100000 },
  { name: "Administratif", price: 40000 },
  { name: "Médical", price: 60000 },
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' FCFA';
};
