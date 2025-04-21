import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiabetesPredictor from "./components/DiabetesPredictor";
import axios from "axios";

// Mock Axios
jest.mock("axios");

// Données de test par défaut
const mockModels = ["random_forest", "xgboost"];
const mockPrediction = { prediction: true, probability: 0.87 };

// Remplir tous les champs automatiquement
const fillForm = () => {
  const data = {
    age: "45",
    glucose: "140",
    bloodpressure: "80",
    skinthickness: "25",
    insulin: "130",
    bodymassindex: "29.5",
    diabetespedigreefunction: "0.5",
    glycatedhemoglobine: "6.8",
  };

  for (const [key, value] of Object.entries(data)) {
    const input = screen.getByLabelText(new RegExp(key, "i"));
    fireEvent.change(input, { target: { value } });
  }
};

describe("Diabetes Predictor Form", () => {
  beforeEach(() => {
    // Mock des modèles IA
    axios.get.mockResolvedValue({ data: mockModels });
  });

  test("affiche tous les champs du formulaire", () => {
    render(<DiabetesPredictor />);

    const fields = [
      "age",
      "glucose",
      "bloodpressure",
      "skinthickness",
      "insulin",
      "bodymassindex",
      "diabetespedigreefunction",
      "glycatedhemoglobine",
    ];

    fields.forEach((field) => {
      const input = screen.getByLabelText(new RegExp(field, "i"));
      expect(input).toBeInTheDocument();
    });
  });

  test("le select des modèles IA est affiché", () => {
    render(<DiabetesPredictor />);
    const select = screen.getByLabelText(/modèle ia/i);
    expect(select).toBeInTheDocument();
  });

  test("le bouton Prédire est présent", () => {
    render(<DiabetesPredictor />);
    const button = screen.getByRole("button", { name: /prédire/i });
    expect(button).toBeInTheDocument();
  });

  test("fait une prédiction quand on soumet le formulaire", async () => {
    axios.post.mockResolvedValue({ data: mockPrediction });

    render(<DiabetesPredictor />);

    // Remplir tous les champs requis
    fillForm();

    // Sélectionner un modèle
    const select = screen.getByLabelText(/modèle ia/i);
    fireEvent.change(select, { target: { value: mockModels[0] } });

    // Soumettre le formulaire
    const button = screen.getByRole("button", { name: /prédire/i });
    fireEvent.click(button);

    // Vérifier que le résultat s'affiche
    await waitFor(() =>
      expect(
        screen.getByText(/risque de diabète détecté/i)
      ).toBeInTheDocument()
    );
  });
});
