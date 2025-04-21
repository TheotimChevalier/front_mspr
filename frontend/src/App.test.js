import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiabetesPredictor from "./components/DiabetesPredictor";
import axios from "axios";

// ⛔️ On mock axios
jest.mock(`axios`);

describe("DiabetesPredictor Component", () => {
  it("affiche tous les champs du formulaire", () => {
    render(<DiabetesPredictor />);
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/glucose/i)).toBeInTheDocument();
    expect(screen.getByText(/Prédire/i)).toBeInTheDocument();
  });

  it("permet de remplir un champ", () => {
    render(<DiabetesPredictor />);
    const input = screen.getByLabelText(/age/i);
    fireEvent.change(input, { target: { value: "45" } });
    expect(input.value).toBe("45");
  });

  it("envoie le formulaire et affiche un résultat simulé", async () => {
    // simulate la réponse d'axios
    axios.get.mockResolvedValue({ data: ["MockModel"] });
    axios.post.mockResolvedValue({
      data: {
        prediction: true,
        probability: 0.82,
      },
    });

    render(<DiabetesPredictor />);

    // Remplir quelques champs
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "140" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/skin/i), { target: { value: "20" } });

    // Choix du modèle (mocké)
    await waitFor(() =>
      expect(screen.getByLabelText(/modèle/i)).toBeInTheDocument()
    );

    fireEvent.change(screen.getByLabelText(/modèle/i), {
      target: { value: "MockModel" },
    });

    // Cliquer sur le bouton
    fireEvent.click(screen.getByText(/prédire/i));

    // Attendre que le résultat s’affiche
    await waitFor(() =>
      expect(screen.getByText(/Risque de diabète détecté/i)).toBeInTheDocument()
    );
  });
});
