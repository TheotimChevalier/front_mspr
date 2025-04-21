import React, { useEffect, useState } from "react";
import axios from "axios";

const DiabetesPredictor = () => {
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [formData, setFormData] = useState({
    age: "",
    glucose: "",
    bloodpressure: "",
    skinthickness: "",
    insulin: "",
    bodymassindex: "",
    diabetespedigreefunction: "",
    glycatedhemoglobine: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:8000/models")
      .then((res) => {
        setModels(res.data);
        if (res.data.length > 0) {
          setSelectedModel(res.data[0]);
        }
      })
      .catch((error) => {
        console.error("Erreur lors du chargement des modèles", error);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [key, parseFloat(val)])
      );
      const response = await axios.post(
        `http://localhost:8000/predict/diabete/${selectedModel}`,
        numericData
      );
      setResult(response.data);
    } catch (error) {
      console.error("Erreur lors de la prédiction :", error);
    }
    setLoading(false);
  };

  return (
    <div>
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="age">Age</label>
        <input
          type="number"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="glucose">Glucose</label>
        <input
          type="number"
          id="glucose"
          name="glucose"
          value={formData.glucose}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="bloodpressure">Blood Pressure</label>
        <input
          type="number"
          id="bloodpressure"
          name="bloodpressure"
          value={formData.bloodpressure}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="skinthickness">Skin Thickness</label>
        <input
          type="number"
          id="skinthickness"
          name="skinthickness"
          value={formData.skinthickness}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="insulin">Insulin</label>
        <input
          type="number"
          id="insulin"
          name="insulin"
          value={formData.insulin}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="bodymassindex">Body Mass Index</label>
        <input
          type="number"
          id="bodymassindex"
          name="bodymassindex"
          value={formData.bodymassindex}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="diabetespedigreefunction">Diabetes Pedigree Function</label>
        <input
          type="number"
          id="diabetespedigreefunction"
          name="diabetespedigreefunction"
          value={formData.diabetespedigreefunction}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="glycatedhemoglobine">Glycated Hemoglobine</label>
        <input
          type="number"
          id="glycatedhemoglobine"
          name="glycatedhemoglobine"
          value={formData.glycatedhemoglobine}
          onChange={handleChange}
        />
      </div>
    </form>

    <div className="select-wrapper">
      <select
        id="model"
        name="model"
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
      >
        <option disabled value="">
          Choose your model
        </option>
        {models.map((model, index) => (
          <option key={index} value={model}>
            {model}
          </option>
        ))}
      </select>
    </div>

    <div className="button-wrapper">
      <button type="submit" disabled={loading} onClick={handleSubmit}>
        {loading ? "Loading..." : "Predict"}
      </button>
    </div>

    {result && (
      <div className="card">
        <h2>Prediction Result</h2>
        <p>
          {result.prediction
            ? `Diabetes risk detected (Probability: ${result.probability.toFixed(2)})`
            : `No significant risk detected (Probability: ${result.probability.toFixed(2)})`}
        </p>
      </div>
    )}
  </div>
);
};

export default DiabetesPredictor;
