export interface Event {
  id: string;
  type: "EMISSION" | "EXERCICE" | "CESSION" | "";
  date: string;
  stock: "Actions" | "BSA" | "BSPCE" | "AGA";
  quantity: number;
  unitPrice: number;
  contact: string;
  seller?: string;
  transferee?: string;
}
