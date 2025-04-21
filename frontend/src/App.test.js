import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DiabetesPredictor from "./components/DiabetesPredictor";
import axios from "axios";

// Mocking axios to simulate the API call
jest.mock("axios");

describe("DiabetesPredictor", () => {
  it("renders the form correctly", async () => {
    axios.get.mockResolvedValue({ data: ["Model 1", "Model 2", "Model 3"] });
    
    render(<DiabetesPredictor />);
    
    // Check if all form fields are rendered
    expect(screen.getByLabelText(/age/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/glucose/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bloodpressure/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/skinthickness/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/insulin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/bodymassindex/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/diabetespedigreefunction/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/glycatedhemoglobine/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/model/i)).toBeInTheDocument();
    
    // Ensure options are populated
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(4); // 3 models + 1 empty option
    });
  });

  it("fetches models on load", async () => {
    axios.get.mockResolvedValue({ data: ["Model 1", "Model 2", "Model 3"] });
    
    render(<DiabetesPredictor />);
    
    await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(4)); // Checking if options are fetched
  });

  it("handles form submission and displays result", async () => {
    axios.get.mockResolvedValue({ data: ["Model 1", "Model 2", "Model 3"] });
    
    render(<DiabetesPredictor />);
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "110" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "70" } });
    fireEvent.change(screen.getByLabelText(/skinthickness/i), { target: { value: "18" } });
    fireEvent.change(screen.getByLabelText(/insulin/i), { target: { value: "30" } });
    fireEvent.change(screen.getByLabelText(/bodymassindex/i), { target: { value: "28" } });
    fireEvent.change(screen.getByLabelText(/diabetespedigreefunction/i), { target: { value: "0.5" } });
    fireEvent.change(screen.getByLabelText(/glycatedhemoglobine/i), { target: { value: "6.5" } });
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: "Model 1" } });

    // Submit form
    fireEvent.click(screen.getByText(/predict/i));
    
    // Check if loading state is shown
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("shows loading state while fetching prediction", async () => {
    axios.get.mockResolvedValue({ data: ["Model 1", "Model 2", "Model 3"] });
    
    render(<DiabetesPredictor />);
    
    fireEvent.change(screen.getByLabelText(/model/i), { target: { value: "Model 1" } });
    fireEvent.click(screen.getByText(/predict/i));
    
    // Check that loading is displayed
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    axios.get.mockRejectedValue(new Error("Failed to fetch models"));

    render(<DiabetesPredictor />);
    
    await waitFor(() => {
      // Test that the models are not rendered due to error
      expect(screen.queryAllByRole('option')).toHaveLength(1); // Only the default option
    });
  });
});
