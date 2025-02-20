// src/http/productAPI.ts
import { $authHost } from "./index";
import { Product } from "@/types/types"; // Предположим, у вас есть интерфейс Product

// Получить все товары
export const getProducts = async (): Promise<Product[]> => {
  const { data } = await $authHost.get("/api/product/all");
  return data;
};

// Создать товар (админ)
export const createProduct = async (name: string, attempts: number, starsPrice: number): Promise<Product> => {
  const { data } = await $authHost.post("/api/product/create", { name, attempts, starsPrice });
  return data;
};

// Обновить товар (админ)
export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  const { data } = await $authHost.put(`/api/product/update/${id}`, updates);
  return data;
};

// Удалить товар (админ)
export const deleteProduct = async (id: number): Promise<{ message: string }> => {
  const { data } = await $authHost.delete(`/api/product/delete/${id}`);
  return data;
};

// Сгенерировать invoice link для покупки
export const generateInvoice = async (productId: number) => {
  // Сервер вернёт { invoiceLink: string }
  const { data } = await $authHost.post("/api/payment/generate-invoice", { productId });
  return data.invoiceLink as string;
};
