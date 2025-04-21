import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DiabetesPredictor from "./components/DiabetesPredictor"; // adapte le chemin selon ton projet

jest.mock("axios");

const mockModels = ["model1", "model2"];
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

    // Attendre que les modèles soient chargés
    await waitFor(() => {
      expect(screen.getByDisplayValue("model1")).toBeInTheDocument();
    });

    Object.keys({
      age: "",
      glucose: "",
      bloodpressure: "",
      skinthickness: "",
      insulin: "",
      bodymassindex: "",
      diabetespedigreefunction: "",
      glycatedhemoglobine: "",
    }).forEach((key) => {
      expect(screen.getByLabelText(new RegExp(key, "i"))).toBeInTheDocument();
    });
  });

  test("met à jour les champs du formulaire", async () => {
    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByDisplayValue("model1"));

    const ageInput = screen.getByLabelText(/age/i);
    fireEvent.change(ageInput, { target: { value: "45" } });
    expect(ageInput.value).toBe("45");
  });

  test("change le modèle sélectionné", async () => {
    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByDisplayValue("model1"));

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "model2" } });
    expect(select.value).toBe("model2");
  });

  test("envoie les données et affiche le résultat", async () => {
    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByDisplayValue("model1"));

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

    await waitFor(() =>
      expect(screen.getByText(/Risque de diabète détecté/i)).toBeInTheDocument()
    );

    expect(screen.getByText(/0.87/)).toBeInTheDocument();
  });
});
