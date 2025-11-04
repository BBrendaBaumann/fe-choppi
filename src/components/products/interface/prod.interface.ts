export interface ProductCardProps {
  name: string;
  price: number;
  stock: number;
  image?: string;
  onAdd: () => void;
}