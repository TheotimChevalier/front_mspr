import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";

import {
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";

const initialData = {
  age: "",
  glucose: "",
  bloodpressure: "",
  skinthickness: "",
  insulin: "",
  bodymassindex: "",
  diabetespedigreefunction: "",
  glycatedhemoglobine: "",
};

export default function DiabetesPredictor() {
  const [formData, setFormData] = useState(initialData);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");

  useEffect(() => {
    axios.get("http://localhost:8000/models").then((res) => {
      setModels(res.data);
      if (res.data.length > 0) {
        setSelectedModel(res.data[0]);
      }
    });
  }, []);

  const handleChange = (e) => {
    // Convertir la valeur en nombre, ou laisser "" si le champ est vide
    const value = e.target.value === "" ? "" : parseFloat(e.target.value);
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleModelChange = (e) => {
    setSelectedModel(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // S'assurer que toutes les valeurs sont des nombres valides avant de les envoyer
      const numericData = Object.fromEntries(
        Object.entries(formData).map(([key, val]) => [key, isNaN(val) ? 0 : val])
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

  const chartData = [
    { metric: "Glucose", value: formData.glucose || 0 },
    { metric: "Blood Pressure", value: formData.bloodpressure || 0 },
    { metric: "Skin Thickness", value: formData.skinthickness || 0 },
    { metric: "Insulin", value: formData.insulin || 0 },
    { metric: "BMI", value: formData.bodymassindex || 0 },
    { metric: "DPF", value: formData.diabetespedigreefunction || 0 },
    { metric: "HbA1c", value: formData.glycatedhemoglobine || 0 },
  ];

  return  (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center text-indigo-800">Prédiction du Diabète</h1>

      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        aria-label="Formulaire de prédiction"
      >
        {Object.keys(initialData).map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <Label htmlFor={key} className="text-gray-900">{key}</Label>
            <Input
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              step="any"
              required
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded p-2 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        ))}

        {/* Section Model et Predict centrée */}
        <div className="select-wrapper sm:col-span-2 md:col-span-3 flex flex-col items-center mt-4">
          <Label htmlFor="model" className="text-gray-900">Modèle IA</Label>
          <select
            id="model"
            name="model"
            className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500"
            value={selectedModel}
            onChange={handleModelChange}
          >
            <option value="" disabled>Choisissez votre modèle</option>
            {models.map((modelName) => (
              <option key={modelName} value={modelName}>
                {modelName}
              </option>
            ))}
          </select>
        </div>

        <div className="button-container sm:col-span-2 md:col-span-3 flex justify-center mt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-1/2 mt-4 p-3 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 disabled:bg-indigo-300"
          >
            {loading ? "Chargement..." : "Prédire"}
          </Button>
        </div>
      </form>

      {result && (
        <section className="mt-6">
          <Card className="bg-green-50 dark:bg-green-900">
            <CardContent className="p-4 text-center">
              <h2 className="text-2xl font-semibold">Résultat de la Prédiction</h2>
              <p className="mt-2 text-lg text-green-700 dark:text-green-300">
                {result.prediction
                  ? `Risque de diabète détecté (Probabilité : ${result.probability.toFixed(2)})`
                  : `Pas de risque significatif détecté (Probabilité : ${result.probability.toFixed(2)})`}
              </p>
            </CardContent>
          </Card>

          <div className="mt-6">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 300]} />
                <Radar name="Valeurs" dataKey="value" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}
    </main>
  );
}
