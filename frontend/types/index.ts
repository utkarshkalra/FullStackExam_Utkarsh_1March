export interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: Product;
  quantity: number;
}

export interface Cart {
  _id: string;
  userId: string;
  items: CartItem[];
}

export interface Order {
  id: string;
  userId: string;
  total: number;
  status: "pending" | "completed" | "cancelled";
  createdAt: string;
  OrderItems: OrderItem[];
  User: User;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: Product;
}

export interface DailyRevenue {
  date: string;
  revenue: number;
}

export interface TopSpender {
  userId: string;
  name: string;
  email: string;
  totalSpent: number;
}

export interface CategorySales {
  _id: string;
  totalProducts: number;
  averagePrice: number;
}
