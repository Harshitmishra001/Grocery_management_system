import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { FaShoppingCart } from "react-icons/fa";

export default function MealSuggestion() {
  const [ingredients, setIngredients] = useState("");

  const handleSuggestMeals = () => {
    // Call API or logic to suggest meals based on ingredients
    console.log("Fetching meal suggestions for:", ingredients);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-lg p-4">
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">Meal Suggestion</h2>
          <Textarea
            placeholder="Enter ingredients manually..."
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-4">
            <Button onClick={handleSuggestMeals}>Suggest Meals</Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FaShoppingCart /> Import from Grocery Store
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
