const express = require("express");
const cors = require("cors");
const nodemailer = require('nodemailer');
const InforModel = require("./model");
const route = require("./route");
const mongoose = require('mongoose');
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const app = express();
app.use(cors());
app.use(express.json());
app.use('/', route);
const axios = require("axios");

let Status
let latestData = {brightness:null, temperature: null, humidity: null, moisture:null, timestamp: null};
let MLData = {Soil_Moisture:null,Ambient_Temperature:null,Soil_Temperature:21.900435355069522,Humidity:null,Light_Intensity:null,Soil_pH:5.581954516265902,Nitrogen_Level:10.003649716693408,Phosphorus_Level:45.80685202827101,Potassium_Level:39.0761990273964,Chlorophyll_Content:35.703005710811865,Electrochemical_Signal:0.9414021464707312}

app.post("/api/data", async (req, res) => {
  latestData = {
    ...req.body,
    timestamp: new Date().toISOString()
  };
  console.log("Received:", latestData);
  const data = req.body
  MLData.Soil_Moisture = data.moisture
  MLData.Ambient_Temperature = data.temperature
  MLData.humidity = data.humidity
  MLData.Light_Intensity = data.brightness 

  res.json({ status: "ok" });
});

app.get("/api/data", (req, res) => {
  res.json(latestData);
});

app.get("/api/status", (req,res) => {
  res.json(Status);
})

app.post("/savedata", async (req, res) => {
  try {
    const data = req.body;
    const newData = new InforModel({
      temperature: data.temperature,
      humidity: data.humidity,
      brightness: data.brightness,
      moisture: data.moisture,
    });

    await newData.save();
    res.status(200).json({ message: "Data saved"});
  } catch (err) {
    console.error(err);
    res.status(500).json({error});
  }
});

app.post("/alert", async (req,res) => {
  try {
  const data = req.body
  const msg = {
    to: `dangminhduc1912008@gmail.com`,
    from: process.env.SENDGRID_VERIFIED_SENDER, 
    subject: "Your plant is in bad status",
    text: ` Hi thereee !!
    
    We have detected a bad status !!!
    Your plant is currently ${data}
    Please take care of it more carefull!

    Bye`,
 }
  await sgMail.send(msg);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({err})
  }
})


const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
    // Send immediately once on server start
  sendToFlask();

  // Then send every 5 minutes
  setInterval(sendToFlask, 5 * 60 * 1000);
});
mongoose.connect(`mongodb+srv://duc:ket@sensordata.6qsisr1.mongodb.net/`)
.then(() => console.log('Database is connected'))
.catch((err) => console.error('Failed to connect to MongoDB', err));


async function sendToFlask() {
  try {
    const response = await axios.post("http://127.0.0.1:5001/classify", MLData);
    Status = response.data;
    console.log("Sent MLData to Flask:", MLData);
  } catch (err) {
    console.error("Failed to send to Flask:", err.message);
  }
}
