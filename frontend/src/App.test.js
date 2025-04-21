import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiabetesPredictor from "./components/DiabetesPredictor";
import axios from "axios";

jest.mock("axios");

describe("DiabetesPredictor", () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: ["model1", "model2", "model3"],
    });
  });

  it("renders the form correctly", async () => {
    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4); // 3 modèles + 1 option vide
  });

  it("fetches models on load", async () => {
    render(<DiabetesPredictor />);
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("http://localhost:8000/models"));
    expect(screen.getByRole("combobox")).toHaveValue("model1"); // sélection du modèle par défaut
  });

  it("handles form submission and displays result", async () => {
    axios.post.mockResolvedValue({
      data: { prediction: true, probability: 0.85 },
    });

    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "33" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });
    fireEvent.change(screen.getByLabelText(/skinthickness/i), { target: { value: "20" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "90" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "28.5" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "6.0" } });

    fireEvent.click(screen.getByRole("button", { name: /prédire/i }));

    await waitFor(() => {
      expect(screen.getByText(/risque de diabète détecté/i)).toBeInTheDocument();
    });
  });

  it("shows loading state while fetching prediction", async () => {
    const promise = new Promise((resolve) => setTimeout(() => resolve({ data: { prediction: false, probability: 0.15 } }), 500));
    axios.post.mockReturnValue(promise);

    render(<DiabetesPredictor />);
    await waitFor(() => screen.getByRole("combobox"));

    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "110" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "70" } });
    fireEvent.change(screen.getByLabelText(/skinthickness/i), { target: { value: "18" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "85" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "22.3" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.2" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "5.4" } });

    fireEvent.click(screen.getByRole("button", { name: /prédire/i }));

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/chargement/i)).not.toBeInTheDocument();
    });
  });
});
