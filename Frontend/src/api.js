// src/api.js
export async function suggestRecipes(ingredients) {
  const API_URL = "http://localhost:8000"; // hardcoded for local dev
  const res = await fetch(`${API_URL}/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ingredients),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed: ${res.status} ${text}`);
  }

  return res.json();
}
