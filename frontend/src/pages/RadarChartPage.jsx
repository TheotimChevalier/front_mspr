// src/pages/RadarChartPage.jsx
import RadarGraphPage from "../components/RadarGraphPage";

export default function RadarChartPage() {
 useEffect(() => {
     document.title = "Prediction Diabete"; 
   }, []); 
 
   return <RadarGraphPage />;
}
