// src/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Local Storage Keys
const STORAGE_KEYS = {
  INVENTORY: 'grocery_inventory',
  USER: 'grocery_user',
  TOKEN: 'grocery_token'
};

// Helper function to get data from localStorage
const getStorageData = (key, defaultValue = []) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue;
  }
};

// Helper function to save data to localStorage
const setStorageData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing to localStorage: ${error}`);
  }
};

// Authentication
export const loginUser = async (credentials) => {
  // For demo purposes, accept any login
  const user = {
    _id: Date.now().toString(),
    email: credentials.email,
    name: credentials.email.split('@')[0],
    role: 'user'
  };
  const token = 'demo-token-' + Date.now();
  
  setStorageData(STORAGE_KEYS.USER, user);
  setStorageData(STORAGE_KEYS.TOKEN, token);
  
  return { user, token };
};

export const registerUser = async (userData) => {
  return loginUser(userData); // Same as login for demo
};

export const logoutUser = () => {
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
};

// Inventory Management
export const getInventory = async () => {
  const inventory = getStorageData(STORAGE_KEYS.INVENTORY, []);
  return { inventory, count: inventory.length };
};

export const addInventoryItem = async (itemData) => {
  const inventory = getStorageData(STORAGE_KEYS.INVENTORY, []);
  const user = getStorageData(STORAGE_KEYS.USER);

  // Validate required fields
  if (!itemData.name || !itemData.description || !itemData.price) {
    throw new Error('Name, description, and price are required');
  }

  const newItem = {
    _id: Date.now().toString(),
    ...itemData,
    createdBy: user._id,
    lastModifiedBy: user._id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  inventory.push(newItem);
  setStorageData(STORAGE_KEYS.INVENTORY, inventory);

  return { message: 'Item added successfully', item: newItem };
};

export const updateInventoryItem = async (itemId, itemData) => {
  const inventory = getStorageData(STORAGE_KEYS.INVENTORY, []);
  const index = inventory.findIndex(item => item._id === itemId);

  if (index === -1) {
    throw new Error('Item not found');
  }

  const updatedItem = {
    ...inventory[index],
    ...itemData,
    updatedAt: new Date().toISOString()
  };

  inventory[index] = updatedItem;
  setStorageData(STORAGE_KEYS.INVENTORY, inventory);

  return { message: 'Item updated successfully', item: updatedItem };
};

export const deleteInventoryItem = async (itemId) => {
  const inventory = getStorageData(STORAGE_KEYS.INVENTORY, []);
  const filteredInventory = inventory.filter(item => item._id !== itemId);
  setStorageData(STORAGE_KEYS.INVENTORY, filteredInventory);

  return { message: 'Item deleted successfully' };
};

// Orders Management
export const getOrders = async () => {
  try {
    const response = await api.get('/orders');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch orders' };
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/orders', orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to create order' };
  }
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await api.put(`/orders/${orderId}`, orderData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to update order' };
  }
};

export const deleteOrder = async (orderId) => {
  try {
    const response = await api.delete(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to delete order' };
  }
};

// New: Fetch recipes (simulate with dummy data)
export async function fetchRecipes() {
    // In a real scenario, this would be a call to your backend or external recipe API.
    return {
      recipes: [
        {
          id: 1,
          name: "Pasta with Tomato Sauce",
          ingredients: [
            { name: "Pasta", quantityPerServing: 100 }, // grams per serving
            { name: "Tomato Sauce", quantityPerServing: 150 }
          ],
          instructions: "Boil pasta, heat sauce, and mix."
        },
        {
          id: 2,
          name: "Vegetable Stir-Fry",
          ingredients: [
            { name: "Mixed Vegetables", quantityPerServing: 200 },
            { name: "Soy Sauce", quantityPerServing: 30 }
          ],
          instructions: "Stir-fry vegetables and add soy sauce."
        }
      ]
    };
  }
  export async function fetchPriceComparison(itemName) {
    // Simulated response; in production, replace with actual API calls.
    const dummyResponse = {
      item: itemName,
      deals: [
        { platform: 'Zepto', price: 3.99, deliveryTime: '30 mins' },
        { platform: 'Instamart', price: 4.29, deliveryTime: '25 mins' }
      ]
    };
    return new Promise((resolve) => {
      setTimeout(() => resolve(dummyResponse), 1000);
    });
  }