import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./App.css";

function App() {
  const [chartTempData, setChartTempData] = useState([]);
  const [chartHumidData, setChartHumidData] = useState([]);
  const [chartBrightData, setChartBrightData] = useState([]);
  const [chartMoisture, setChartMoisture] = useState([]);
  const [status, setStatus] = useState({ prediction: "Loading..." });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sensor data
        const res = await fetch("http://192.168.76.113:5000/api/data");
        const json = await res.json();

        // Fetch plant status returned from Flask ML model
        const statusRes = await fetch("http://192.168.76.113:5000/api/status");

        let statusJson;
        try {
          statusJson = await statusRes.json();
        } catch {
          statusJson = { prediction: "Waiting for ML response..." };
        }
        setStatus(statusJson);

        const now = new Date().toLocaleTimeString();

        setChartTempData(prev => [...prev.slice(-19), { time: now, temp: json.temperature }]);
        setChartHumidData(prev => [...prev.slice(-19), { time: now, humid: json.humidity }]);
        setChartBrightData(prev => [...prev.slice(-19), { time: now, brightness: json.brightness }]);
        setChartMoisture(prev => [...prev.slice(-19), { time: now, moisture: json.moisture }]);

      } catch (err) {
        console.error("Frontend error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-container">

      {/* STATUS CARD */}
      <div className="status-card">
        <h2 className="status-title">Plant Status</h2>
        <p className="status-value">
          {status?.prediction || "Loading..."}
        </p>
      </div>

      <h2 className="app-title">Brightness, Temperature, Humidity & Moisture</h2>
      <div className="charts">

        {/* TEMPERATURE */}
        <div className="chart-card">
          <h3 className="chart-title">Temperature</h3>
          <LineChart width={600} height={300} data={chartTempData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="temp" stroke="#ff7300" dot />
          </LineChart>
        </div>

        {/* HUMIDITY */}
        <div className="chart-card">
          <h3 className="chart-title">Humidity</h3>
          <LineChart width={600} height={300} data={chartHumidData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="humid" stroke="#3f51b5" dot />
          </LineChart>
        </div>

        {/* BRIGHTNESS */}
        <div className="chart-card">
          <h3 className="chart-title">Brightness</h3>
          <LineChart width={600} height={300} data={chartBrightData}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="brightness" stroke="#4caf50" dot />
          </LineChart>
        </div>

        {/* MOISTURE */}
        <div className="chart-card">
          <h3 className="chart-title">Moisture</h3>
          <LineChart width={600} height={300} data={chartMoisture}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="moisture" stroke="#4caf50" dot />
          </LineChart>
        </div>

      </div>
    </div>
  );
}

export default App;
