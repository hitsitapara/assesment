export interface Product {
  id: number;
  title: string;
  variants: Variants[];
  isOpen?: boolean;
  image: {
    id: number;
    src: string;
  };
  price: number;
  discount?: {
    isAvailable: boolean;
    discountAmount?: number;
    discountType?: number;
  };
}

interface Variants {
  id: number;
  title: string;
  price: number;
  inventory_quantity: number;
  discount?: {
    isAvailable: boolean;
    discountAmount?: number;
    discountType?: number;
  };
}
