// src/components/MealPlanner.js
import React, { useState, useEffect } from 'react';
import { fetchRecipes } from '../api';

function MealPlanner({ inventory, onUpdateInventory }) {
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [servings, setServings] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function getRecipes() {
      const data = await fetchRecipes();
      setRecipes(data.recipes);
    }
    getRecipes();
  }, []);

  const handleSelectRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setMessage('');
  };

  // Function to simulate inventory deduction based on recipe and servings
  const handlePrepareMeal = () => {
    if (!selectedRecipe) return;
    // Calculate the required ingredients for the selected servings
    const updatedInventory = inventory.map((item) => {
      // Check if this item is needed in the selected recipe
      const ingredient = selectedRecipe.ingredients.find(
        (ing) => ing.name.toLowerCase() === item.name.toLowerCase()
      );
      if (ingredient) {
        const totalNeeded = ingredient.quantityPerServing * servings;
        return {
          ...item,
          quantity: item.quantity - totalNeeded > 0 ? item.quantity - totalNeeded : 0
        };
      }
      return item;
    });
    onUpdateInventory(updatedInventory);
    setMessage(`Prepared ${servings} serving(s) of ${selectedRecipe.name}. Inventory updated.`);
    setSelectedRecipe(null);
    setServings(1);
  };

  return (
    <div>
      <h3>Meal Planner</h3>
      <div>
        <h4>Available Recipes</h4>
        <ul>
          {recipes.map((recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.name}</strong>
              <button onClick={() => handleSelectRecipe(recipe)}>Select</button>
            </li>
          ))}
        </ul>
      </div>
      {selectedRecipe && (
        <div>
          <h4>Recipe: {selectedRecipe.name}</h4>
          <p>{selectedRecipe.instructions}</p>
          <label>
            Servings:
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(parseInt(e.target.value, 10))}
              min="1"
            />
          </label>
          <button onClick={handlePrepareMeal}>Prepare Meal</button>
        </div>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}

export default MealPlanner;
