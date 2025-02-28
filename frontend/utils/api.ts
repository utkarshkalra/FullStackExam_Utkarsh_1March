import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://fullstackexam-utkarsh-1march.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  // Only try to access localStorage in browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const auth = {
  register: async (data: {
    email: string;
    password: string;
    name: string;
    address: string;
  }) => api.post("/auth/register", data),
  login: async (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getProfile: async () => api.get("/auth/profile"),
};

export const products = {
  list: async ({ page = 1, limit = 10, search = "", category = "" } = {}) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(category && { category }),
    });
    return api.get(`/products?${params}`);
  },

  getById: async (id: string) => {
    return api.get(`/products/${id}`);
  },

  create: async (data: object) => {
    return api.post("/products", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  update: async (id: string, formData: FormData) => {
    return api.put(`/products/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  delete: async (id: string) => {
    return api.delete(`/products/${id}`);
  },
};

export const cart = {
  get: async () => api.get("/cart"),
  addItem: async (data: { productId: string; quantity: number }) =>
    api.post("/cart/items", data),
  updateItem: async (data: { productId: string; quantity: number }) =>
    api.put("/cart/items", data),
  removeItem: async (productId: string) =>
    api.delete(`/cart/items/${productId}`),
  clear: async () => api.delete("/cart"),
};

export const orders = {
  create: async () => api.post("/orders"),
  list: async () => api.get("/orders"),
  getById: async (id: string) => api.get(`/orders/${id}`),
  listAll: async () => api.get("/orders/admin/all"), // Admin endpoint
  updateStatus: async (orderId: string, status: string) =>
    api.patch(`/orders/admin/${orderId}/status`, { status }),
};

export const reports = {
  getDailyRevenue: async () => api.get("/reports/daily-revenue"),
  getTopSpenders: async () => api.get("/reports/top-spenders"),
  getCategorySales: async () => api.get("/reports/category-sales"),
};

export default api;
