import React, { useState, useEffect } from "react";
import { suggestRecipes } from "../api";

const INGREDIENTS_KEY = "ingredients";

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const stored = localStorage.getItem(INGREDIENTS_KEY);
        const ingredients = stored ? JSON.parse(stored) : [];

        if (!ingredients || ingredients.length === 0) {
          setError("No ingredients found. Add some on the Home page.");
          setLoading(false);
          return;
        }

        const data = await suggestRecipes(ingredients);
        setRecipes(data);
      } catch (err) {
        setError(err.message || "Failed to fetch recipes.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <div className="recipesContainer"><div className="loading">Loading...</div></div>;
  if (error) return <div className="recipesContainer"><div className="error">{error}</div></div>;

  return (
    <div className="recipesContainer">
      <div className="recipesTop">
        <button className="ghostBtn" onClick={() => (window.location.href = "/")}>← Home</button>
        <h1 className="recipesTitle">Recipe Suggestions</h1>
      </div>

      {recipes.length === 0 ? (
        <div className="noResults">No matching recipes found.</div>
      ) : (
        <div className="cardsGrid">
          {recipes.map((rec, idx) => (
            <article className="card" key={rec.id ?? rec.name}>
              <header className="cardHeader">
                <h2 className="cardTitle">{rec.name}</h2>
                <div className="matchBadge">{rec.matchPercentage}%</div>
              </header>

              <div className="cardBanner macrosBanner">
                <div className="macrosRow">
                  <div className="macroLabel">Protein</div>
                  <div className="macroVal">{rec.macros?.protein_g ?? "—"}g</div>
                </div>
                <div className="macrosRow">
                  <div className="macroLabel">Carbs</div>
                  <div className="macroVal">{rec.macros?.carbs_g ?? "—"}g</div>
                </div>
                <div className="macrosRow">
                  <div className="macroLabel">Fat</div>
                  <div className="macroVal">{rec.macros?.fat_g ?? "—"}g</div>
                </div>
              </div>

              <div className="cardBody">
                <p className="leadText">You currently have {rec.matchPercentage}% of the ingredients.</p>

                <div className="actionsRow">
                  <button
                    className="btn pill"
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    aria-expanded={openIndex === idx}
                    aria-controls={`ingredients-${idx}`}
                  >
                    {openIndex === idx ? "Hide ingredients" : "View ingredients"}
                  </button>
                </div>

                {openIndex === idx && (
                  <div id={`ingredients-${idx}`} className="ingredientsExpanded">
                    <ul className="ingredientsList">
                      {/*
                        single list: color-coded items
                        available = matchedIngredients (green), missing = missingIngredients (red)
                      */}
                      {rec.matchedIngredients && rec.matchedIngredients.map((ing) => (
                        <li key={`ok-${ing}`} className="ing available">{ing}</li>
                      ))}
                      {rec.missingIngredients && rec.missingIngredients.map((ing) => (
                        <li key={`miss-${ing}`} className="ing missing">{ing}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
