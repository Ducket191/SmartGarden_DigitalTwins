import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import "./App.css";

function App() {
  const [chartTempData, setChartTempData] = useState([]);
  const [chartHumidData, setChartHumidData] = useState([]);
  const [chartBrightData, setChartBrightData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://192.168.1.3:5000/api/data");
        const json = await res.json();

        const now = new Date().toLocaleTimeString();
        setChartTempData(prev => {
          const updated = [...prev, { time: now, temp: json.temperature}];
          return updated.slice(-20);
        });
        setChartHumidData(prev => {
          const updated = [...prev, {time:now, humid: json.humidity}];
          return updated.slice(-20);
        });
        setChartBrightData(prev => {
          const updated = [...prev, { time: now, brightness: json.brightness}];
          return updated.slice(-20);
        })
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);


return (
  <div className="app-container">
    <h2 className="app-title">Brightness, Temperature, and Humidity Over Time</h2>
    <div className="charts">
      <div className="chart-card">
        <h3 className="chart-title">Temperature</h3>
        <LineChart width={600} height={300} data={chartTempData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} label={{ value: '°C', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="temp" stroke="#ff7300" dot />
        </LineChart>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Humidity</h3>
        <LineChart width={600} height={300} data={chartHumidData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="humid" stroke="#3f51b5" dot />
        </LineChart>
      </div>

      <div className="chart-card">
        <h3 className="chart-title">Brightness</h3>
        <LineChart width={600} height={300} data={chartBrightData}>
          <CartesianGrid stroke="#ccc" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Line type="monotone" dataKey="brightness" stroke="#4caf50" dot />
        </LineChart>
      </div>
    </div>
  </div>
);

}

export default App;
