const axios = {
    post: jest.fn().mockResolvedValue({ data: { prediction: true, probability: 0.85 } }),
    get: jest.fn().mockResolvedValue({ data: ['model1', 'model2'] }),
  };
  
  export default axios;
  