module.exports = {
    transform: {
      "^.+\\.[jt]sx?$": "babel-jest", // transforme tout le JS et JSX
    },
    transformIgnorePatterns: [
      "/node_modules/(?!axios)/", // Ajoute axios à la liste des modules à transformer
    ],
    testEnvironment: "jsdom", // Environnement de test pour les projets React
  };
  