import { useState } from "react";
import "./App.css";

// Usamos directamente la URL de Render para el backend sin variables de entorno
// const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

function App() {
  const [result, setResult] = useState("");

  return (
    <div className="App">
      <h1>MERN Render</h1>

      <button
        onClick={async () => {
          const res = await fetch("https://backend-web-clcy.onrender.com/ping");
          const data = await res.json();
          setResult(data);
        }}
      >
        Users
      </button>

      <pre>{JSON.stringify(result, null, 2)}</pre>
    </div>
  );
}

export default App;
