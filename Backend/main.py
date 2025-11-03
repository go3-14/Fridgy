# Backend/main.py
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="Fridgy Simple Recommender")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during development OK; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RECIPES_PATH = "recipes.json"

if not os.path.exists(RECIPES_PATH):
    raise FileNotFoundError(f"{RECIPES_PATH} not found. Put your recipes.json in the Backend folder.")

with open(RECIPES_PATH, "r", encoding="utf-8") as f:
    RECIPES_DB = json.load(f)

def normalize(s: str) -> str:
    return s.strip().lower()

def compute_similarity_and_sets(user_ings, recipe_ings):
    """
    user_ings: list of strings (not necessarily normalized)
    recipe_ings: list of strings (raw from json)
    returns: similarity (0..1), matched list, missing list
    """
    user_set = set(normalize(x) for x in user_ings if isinstance(x, str) and x.strip())
    recipe_norm = [normalize(x) for x in (recipe_ings or []) if isinstance(x, str)]
    recipe_set = set(recipe_norm)

    if not recipe_set:
        return 0.0, [], []

    matched = sorted([ing for ing in recipe_set if ing in user_set])
    missing = sorted([ing for ing in recipe_norm if ing not in user_set])

    similarity = len(matched) / len(recipe_set)
    return similarity, matched, missing

@app.post("/suggest")
async def suggest(ingredients: list[str]):
    """
    POST /suggest
    body: JSON array of ingredient strings, e.g. ["egg", "butter"]
    response: sorted list of recipes with fields:
      - id (if present)
      - name
      - ingredients (original list)
      - macros (if present)
      - matchPercentage (int 0-100)
      - similarity (0..1 float)
      - matchedIngredients (list)
      - missingIngredients (list)
      - missingCount (int)
    Note: 0% matches are filtered out (only recipes with at least one matched ingredient are returned)
    """
    if not isinstance(ingredients, list):
        raise HTTPException(status_code=400, detail="Send an array of ingredient strings in the request body.")

    # build results
    results = []
    for r in RECIPES_DB:
        recipe_ings = r.get("ingredients", []) or []
        similarity, matched, missing = compute_similarity_and_sets(ingredients, recipe_ings)
        match_pct = int(round(similarity * 100))

        results.append({
            "id": r.get("id"),
            "name": r.get("name"),
            "ingredients": recipe_ings,
            "macros": r.get("macros", {}),
            "similarity": round(similarity, 4),
            "matchPercentage": match_pct,
            "matchedIngredients": matched,
            "missingIngredients": missing,
            "missingCount": len(missing)
        })

    # sort by matchPercentage desc, then by number of matched items desc
    results.sort(key=lambda x: (x["matchPercentage"], len(x.get("matchedIngredients", []))), reverse=True)

    # remove only 0% matches
    results = [r for r in results if r["matchPercentage"] > 0]

    return results
