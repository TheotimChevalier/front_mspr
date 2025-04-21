const axios = {
    get: jest.fn().mockResolvedValue({ data: [] }),  // Ou autre valeur en fonction de ta logique
    post: jest.fn().mockResolvedValue({ data: { prediction: true, probability: 0.85 } }),
  };
  
  export default axios;