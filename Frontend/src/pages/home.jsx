// src/pages/home.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const INGREDIENTS_KEY = "ingredients";

function Home() {
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredientsList, setIngredientsList] = useState(() => {
    const stored = localStorage.getItem(INGREDIENTS_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate();

  const addIngredient = () => {
    const v = ingredientInput.trim().toLowerCase();
    if (!v) return;
    if (!ingredientsList.includes(v)) {
      const newList = [...ingredientsList, v];
      setIngredientsList(newList);
      localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(newList));
    }
    setIngredientInput("");
  };

  const removeIngredient = (item) => {
    const newList = ingredientsList.filter(i => i !== item);
    setIngredientsList(newList);
    localStorage.setItem(INGREDIENTS_KEY, JSON.stringify(newList));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addIngredient();
  };

  return (
    <div className="homeWrapper">
      <header className="homeHeader">
        <h1 className="brand">Fridgy</h1>
        <p className="leading">What do you have in your fridge?</p>
      </header>

      <div className="homeControls">
        <input
          className="homeInput"
          placeholder="e.g. egg, tomato, milk"
          value={ingredientInput}
          onChange={(e) => setIngredientInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn primary" onClick={addIngredient}>Add</button>
      </div>

      <div className="chipsRow">
        {ingredientsList.length === 0 ? (
          <div className="emptyState">No ingredients yet. Add a few to get suggestions.</div>
        ) : (
          ingredientsList.map(item => (
            <div key={item} className="chip">
              <span className="chipText">{item}</span>
              <button className="chipRemove" onClick={() => removeIngredient(item)}>✕</button>
            </div>
          ))
        )}
      </div>

      <div className="homeFooter">
        <div className="countText">You currently have <strong>{ingredientsList.length}</strong> ingredient{ingredientsList.length !== 1 ? "s" : ""}.</div>
        <button
          className="btn find"
          disabled={ingredientsList.length === 0}
          onClick={() => navigate("/recipes")}
        >
          Find Recipes
        </button>
      </div>
    </div>
  );
}

export default Home;
