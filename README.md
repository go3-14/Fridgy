# 🧊 Fridgy — AI Recipe Recommender from Your Fridge

Fridgy recommends recipes **based on what you already have at home**.

Just type the ingredients you currently have → Fridgy auto calculates best matches and shows what you’re missing.

---

## ✨ Features

- Add ingredients you currently have
- See recipes sorted by match %
- Shows:
  - ✅ available ingredients
  - ❌ missing ingredients
- Nutrition macros (Protein / Carbs / Fats)
- Clean modern reddit-style UI (Inter Font)

---

## 🧠 Powered by FastAPI + React

| Part | Tech |
|------|------|
| Backend API | FastAPI (Python) |
| Frontend UI | React + Vite |
| Styles | Plain CSS |

---

## Make it Run Locally

### 1) Backend

bash
cd Backend
pip install -r requirements.txt
uvicorn main:app --reload


Backend will run at:
http://localhost:8000


2) Frontend
   cd Frontend
npm install
npm run dev
Frontend will run at:

http://localhost:5173


Folder Structure

Fridgy/
 ├── Backend/
 │    ├── main.py
 │    └── recipes.json
 └── Frontend/
      ├── src/
      │   ├── pages/
      │   │   ├── home.jsx
      │   │   └── recipes.jsx
      │   ├── api.js
      │   └── styles.css
      └── index.html

      



