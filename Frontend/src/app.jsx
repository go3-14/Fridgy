import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import Recipes from './pages/recipes';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/recipes" element={<Recipes />} />
    </Routes>
  );
}

export default App;