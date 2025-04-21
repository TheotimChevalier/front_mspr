import React, { useEffect } from 'react';  
import RadarGraphPage from "../components/RadarGraphPage";

export default function RadarChartPage() {
  useEffect(() => {
    document.title = "Prediction Diabete"; 
  }, []); 

  return (
    <>
      <h2>On peut créer autant de pages que l'on veut en fonction des données/maladies que l'on souhaite.</h2>
      <RadarGraphPage />
    </>
  );
}
