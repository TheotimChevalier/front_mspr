import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DiabetesPredictor from "./components/DiabetesPredictor"; // adapte le chemin selon ton projet

// Mock de ResizeObserver pour Jest
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}; 

jest.mock("axios");

const mockModels = ["diabetes_model", "bmi_model", "bloodpressure_model"];
const mockPrediction = {
  prediction: true,
  probability: 0.87,
};

describe("DiabetesPredictor", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockModels });
    axios.post.mockResolvedValue({ data: mockPrediction });
  });

  test("affiche tous les champs du formulaire", async () => {
    render(<DiabetesPredictor />);
  
    // Attendre que le modèle soit chargé et visible dans le DOM
    await waitFor(() => screen.getByText(/Modèle IA/i));
  
    // Déboguer le DOM au cas où un élément manquerait
    screen.debug();
  
    const fields = [
      "age", "glucose", "bloodpressure", "skinthickness", "insulin",
      "bodymassindex", "diabetespedigreefunction", "glycatedhemoglobine"
    ];
  
    fields.forEach((field) => {
      expect(screen.getByLabelText(new RegExp(field, "i"))).toBeInTheDocument();
    });
  });

  test("met à jour les champs du formulaire", async () => {
    render(<DiabetesPredictor />);

    // Attendre que les champs du formulaire soient visibles
    await waitFor(() => screen.getByLabelText(/age/i));

    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: "45" } });
    expect(ageInput.value).toBe("45");
  });

  test("change le modèle sélectionné", async () => {
    render(<DiabetesPredictor />);

    // Attendre que le modèle par défaut soit chargé et visible
    await waitFor(() => screen.getByDisplayValue("diabetes_model"));

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "bmi_model" } });
    expect(select.value).toBe("bmi_model");
  });

  test("envoie les données et affiche le résultat", async () => {
    render(<DiabetesPredictor />);
  
    // Attendre que les champs du formulaire soient visibles
    await waitFor(() => screen.getByLabelText(/age/i));
  
    // Remplir tous les champs requis
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/skinthickness/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "90" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "28" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "6.5" } });
  
    const button = screen.getByRole("button", { name: /prédire/i });
    fireEvent.click(button);
  
    // Attendre que le résultat de la prédiction (risque de diabète) soit affiché
    await waitFor(() => screen.getByText(/Risque de diabète détecté/i));
  
    // Attendre que la probabilité (0.87) soit affichée
    await waitFor(() => screen.getByText(/0.87/i, { timeout: 1000 }));
  
    // Vérifier que la probabilité (0.87) est bien présente
    expect(screen.getByText(/0.87/i)).toBeInTheDocument();
  });
});
