import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import DiabetesPredictor from './components/DiabetesPredictor';
import axios from 'axios';
import { act } from 'react'; // Assurez-vous que `act` est importé depuis 'react'

jest.mock('axios');

describe('DiabetesPredictor', () => {

  beforeEach(() => {
    // Mock des réponses de l'API
    axios.get.mockResolvedValue({
      data: ['diabetes_model', 'bloodpressure_model', 'bmi_model']
    });
    axios.post.mockResolvedValue({
      data: {
        prediction: true,
        probability: 0.85
      }
    });
  });

  it('renders the form correctly', async () => {
    render(<DiabetesPredictor />);
    
    // Vérifier que les champs du formulaire sont bien affichés
    const inputs = screen.getAllByRole('spinbutton');
    expect(inputs).toHaveLength(8); // 8 champs (age, glucose, bloodpressure, etc.)
    
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(4); // 3 modèles + 1 option vide
  });

  it('fetches models on load', async () => {
    // Envelopper l'appel de render dans 'act()' pour gérer les mises à jour d'état asynchrones
    await act(async () => {
      render(<DiabetesPredictor />);
    });
    
    // Attendre que l'API de modèles soit appelée
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/models'));
    
    // Vérifier que le premier modèle est sélectionné par défaut
    expect(screen.getByRole('combobox')).toHaveValue('diabetes_model'); // Vérification que le modèle par défaut est correct
  });

  it('handles form submission and displays result', async () => {
    render(<DiabetesPredictor />);

    // Remplir les champs du formulaire avec des valeurs
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "110" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "70" } });
    fireEvent.change(screen.getByLabelText(/skinthickness/i), { target: { value: "18" } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText(/Prédire/i));

    // Attendre que la prédiction soit reçue et affichée
    await waitFor(() => screen.getByText(/Risque de diabète détecté/));
    
    // Vérifier le contenu du résultat de la prédiction
    expect(screen.getByText(/Risque de diabète détecté/)).toBeInTheDocument();
    expect(screen.getByText(/Probabilité : 0.85/)).toBeInTheDocument();
  });

  it('shows loading state while fetching prediction', async () => {
    // Simuler un délai de réponse API
    axios.post.mockResolvedValueOnce(new Promise(resolve => setTimeout(() => resolve({
      data: {
        prediction: false,
        probability: 0.1
      }
    }), 3000)));

    render(<DiabetesPredictor />);

    // Remplir les champs du formulaire
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "33" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "150" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "80" } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText(/Prédire/i));

    // Vérifier que l'état "Chargement..." est affiché
    expect(screen.getByText(/Chargement.../)).toBeInTheDocument();
    
    // Attendre la fin du chargement et vérifier le résultat
    await waitFor(() => screen.getByText(/Pas de risque significatif détecté/));
  });

  it('handles API error gracefully', async () => {
    // Simuler une erreur dans l'appel de l'API
    axios.post.mockRejectedValue(new Error('Erreur serveur'));

    render(<DiabetesPredictor />);

    // Remplir les champs du formulaire
    fireEvent.change(screen.getByLabelText(/age/i), { target: { value: "25" } });
    fireEvent.change(screen.getByLabelText(/glucose/i), { target: { value: "110" } });
    fireEvent.change(screen.getByLabelText(/bloodpressure/i), { target: { value: "70" } });

    // Soumettre le formulaire
    fireEvent.click(screen.getByText(/Prédire/i));

    // Vérifier que l'état "Chargement..." est affiché
    expect(screen.getByText(/Chargement.../)).toBeInTheDocument();
    
    // Attendre que l'erreur soit capturée et affichée
    await waitFor(() => expect(screen.getByText(/Erreur lors de la prédiction/)).toBeInTheDocument());
  });
});
