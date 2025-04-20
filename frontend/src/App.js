// src/App.js
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import RadarChartPage from "./pages/RadarChartPage";
import './App.css';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/radar" element={<RadarChartPage />} />
        {/* Ajoute d'autres pages ici */}
      </Routes>
    </Router>
  );
}

export default App;
