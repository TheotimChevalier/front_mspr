import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import DiabetesPredictor from "./components/DiabetesPredictor"; 

jest.mock("axios");  // Simule axios

describe("DiabetesPredictor", () => {
  it("renders the form correctly", () => {
    render(<DiabetesPredictor />);

    // Vérifiez que les champs du formulaire sont bien rendus
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/glucose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bloodpressure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skin thickness/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/insulin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bodymassindex/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/diabetespedigreefunction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/glycatedhemoglobine/i)).toBeInTheDocument();

    // Vérifiez que le bouton prédire est bien présent
    expect(screen.getByRole("button", { name: /prédire/i })).toBeInTheDocument();
  });

  it("fetches models on load", async () => {
    // Simulez la réponse d'une requête GET pour obtenir les modèles
    axios.get.mockResolvedValueOnce({
      data: ["model1", "model2", "model3"], 
    });

    render(<DiabetesPredictor />);

    // Attendez que la liste déroulante soit rendue et vérifiez la présence des options
    await waitFor(() => screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4); // 3 modèles + 1 option vide
  });

  it("handles form submission and displays result", async () => {
    // Simulez la réponse d'une requête POST pour obtenir un résultat de prédiction
    axios.post.mockResolvedValueOnce({
      data: { prediction: true, probability: 0.85 },
    });

    render(<DiabetesPredictor />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/skin thickness/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "85" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "5.5" } });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "model1" } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: /prédire/i }));

    // Vérifier que la prédiction est affichée
    await waitFor(() => screen.getByText(/risque de diabète détecté/i));
    expect(screen.getByText(/probabilité : 0.85/i)).toBeInTheDocument();
  });

  it("shows loading state while fetching prediction", async () => {
    // Simulez la requête POST pendant que l'état de chargement est activé
    axios.post.mockResolvedValueOnce({
      data: { prediction: true, probability: 0.85 },
    });

    render(<DiabetesPredictor />);

    // Remplir le formulaire
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "50" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "120" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/skin thickness/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "85" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "5.5" } });

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "model1" } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByRole("button", { name: /prédire/i }));

    // Vérifier que le bouton affiche "Chargement..." avant que la prédiction ne soit affichée
    expect(screen.getByRole("button", { name: /chargement.../i })).toBeInTheDocument();

    // Attendre la réponse et vérifier l'affichage du résultat
    await waitFor(() => screen.getByText(/risque de diabète détecté/i));
  });
});
