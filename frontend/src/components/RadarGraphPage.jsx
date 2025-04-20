import React, { useState } from "react";
import axios from "axios";
import { Card, CardContent } from "./ui/Card";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Label } from "./ui/Label";
import { ResponsiveContainer, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/predict", {
        ...Object.fromEntries(Object.entries(formData).map(([key, val]) => [key, parseFloat(val)])),
      });
      setResult(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const chartData = [
    { metric: "Glucose", value: formData.glucose },
    { metric: "Blood Pressure", value: formData.bloodpressure },
    { metric: "Skin Thickness", value: formData.skinthickness },
    { metric: "Insulin", value: formData.insulin },
    { metric: "BMI", value: formData.bodymassindex },
    { metric: "DPF", value: formData.diabetespedigreefunction },
    { metric: "HbA1c", value: formData.glycatedhemoglobine },
  ];

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4 text-center">Prédiction du Diabète</h1>
      <form
        onSubmit={handleSubmit}
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        aria-label="Formulaire de prédiction"
      >
        {Object.keys(initialData).map((key) => (
          <div key={key} className="flex flex-col gap-1">
            <Label htmlFor={key}>{key}</Label>
            <Input
              type="number"
              id={key}
              name={key}
              value={formData[key]}
              onChange={handleChange}
              step="any"
              required
            />
          </div>
        ))}
        <div className="sm:col-span-2 md:col-span-3">
          <Button type="submit" disabled={loading} className="w-full mt-2">
            {loading ? "Chargement..." : "Prédire"}
          </Button>
        </div>
      </form>

      {result && (
        <section className="mt-6">
          <Card className="bg-green-50 dark:bg-green-900">
            <CardContent className="p-4 text-center">
              <h2 className="text-2xl font-semibold">Résultat de la Prédiction</h2>
              <p className="mt-2 text-lg">
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
