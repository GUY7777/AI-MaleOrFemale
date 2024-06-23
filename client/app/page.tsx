"use client";
import "./page.css";
import React, { useState } from "react";
import ParticleBackground from "./ParticleBackground";

interface Prediction {
  gender: string;
  chance: string;
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState("");
  const [prediction, setPrediction] = useState<Prediction>({
    gender: "",
    chance: "",
  });
  const [loading, setLoading] = useState(false);

  const restPredictionState = () => {
    setPrediction({ gender: "", chance: "" });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    const reader = new FileReader();

    // rest prediction if image has changed
    if (prediction.gender != "") restPredictionState();

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setImageUrl(reader.result);
      }
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const predictImage = async (): Promise<void> => {
    setLoading(true);
    fetch("http://127.0.0.1:8080/api/predict", {
      method: "POST",
      body: JSON.stringify({
        img_path: imageUrl,
      }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setPrediction(data));
    setLoading(false);
  };

  return (
    <main>
      <div className={prediction.gender != "" ? "container hide" : "container"}>
        <div className="title">
          <h1>
            Is it a <span style={{ color: "#00bfff" }}>Boy</span> or a{" "}
            <span style={{ color: "#ed6fe5" }}>Girl</span> ?
          </h1>
        </div>
        <input
          disabled={prediction.gender != ""}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
        <button onClick={predictImage} disabled={!imageUrl || loading}>
          Predict
        </button>
        {imageUrl && (
          <img className="input_image" src={imageUrl} alt="Selected" />
        )}
        {loading && <p>Loading...</p>}
      </div>
      {prediction.gender != "" && (
        <div className="prediction">
          {prediction.gender == "male" ? (
            <>
              <p>
                It's a <span style={{ color: "#00bfff" }}>Boy</span>
              </p>
              <p>{parseInt(prediction.chance)}%</p>
              <img src="boy.png" alt="" />
            </>
          ) : (
            <>
              <p>
                It's a <span style={{ color: "#ed6fe5" }}>Girl</span>
              </p>
              <p>{parseInt(prediction.chance)}%</p>
              <img src="girl.png" alt="" />
            </>
          )}
          <button onClick={restPredictionState}>x</button>
        </div>
      )}
      <ParticleBackground />
    </main>
  );
}
