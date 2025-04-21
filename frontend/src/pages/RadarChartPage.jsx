import React, { useEffect } from 'react';  
import RadarGraphPage from "../components/RadarGraphPage";

export default function RadarChartPage() {
  useEffect(() => {
    document.title = "Prediction Diabete"; 
  }, []); 

  return (
    <>
      <h2>on peut faire autant de page que l'on veut en fonction des données/maladies que l'on souhaite</h2>
      <RadarGraphPage />
    </>
  );
}
