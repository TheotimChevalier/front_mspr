// src/pages/Home.jsx
import React, { useEffect } from 'react';
import DiabetesPredictor from "../components/DiabetesPredictor";

export default function Home() {
  useEffect(() => {
    document.title = "Prediction Diabete"; // Changez le titre ici
  }, []); // Le tableau vide signifie que cela ne s'exécute qu'une fois, lors du premier rendu

  return <DiabetesPredictor />;
}