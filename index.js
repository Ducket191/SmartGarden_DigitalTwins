const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let latestData = { temperature: null, humidity: null, timestamp: null };

app.post("/api/data", (req, res) => {
  latestData = {
    ...req.body,
    timestamp: new Date().toISOString()
  };
  console.log("Received:", latestData);
  res.json({ status: "ok" });
});

app.get("/api/data", (req, res) => {
  res.json(latestData);
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
