// src/api.js

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000/api';

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return response.json();
}

export async function fetchInventory() {
  const response = await fetch(`${API_BASE}/inventory`);
  return response.json();
}

// New: Add inventory item
export async function addInventoryItem(item) {
  const response = await fetch(`${API_BASE}/inventory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return response.json();
}
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