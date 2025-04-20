import { Link } from "react-router-dom";
import { useState } from "react";

export default function Header() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }
  };

  return (
    <header className={`header ${darkMode ? "dark" : ""}`}>
      <nav>
        <ul className={`nav-links ${darkMode ? "dark" : ""}`}>
          <li><Link to="/">Accueil</Link></li>
          <li><Link to="/radar">Graphique Radar</Link></li>
          {/* Ajouter d'autres liens ici */}
        </ul>
      </nav>
      <button
        className={`mode-toggle ${darkMode ? "dark" : ""}`}
        onClick={toggleDarkMode}
      >
        {darkMode ? "Mode Clair" : "Mode Sombre"}
      </button>
    </header>
  );
}
