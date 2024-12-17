export type Product = {
  id: number;
  name: string;
  stock: number;
  pricePurchase: number;
  priceSell: number;
  imageUrl: string | null;
  category: { id: number; name: string };
  rack: { id: number; location: string };
};