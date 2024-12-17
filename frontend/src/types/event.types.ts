export interface Event {
  id: string;
  type: "ISSUANCE" | "EXERCISE" | "TRANSFER";
  date: string;
  stock: "Actions" | "BSA" | "BSPCE" | "AGA";
  quantity: number;
  unitPrice: number;
  data: {
    contact?: string | undefined;
    seller?: string | undefined;
    transferee?: string | undefined;
  };
  createdAt?: string;
  updatedAt?: string;
}
