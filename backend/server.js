require("dotenv").config();
const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/desc", async (req, res) => {
  const { bounds, startYear, endYear } = req.body;

  // Construct a location description based on bounds
  const locationDescription = `Latitude from ${bounds.southWest.lat} to ${bounds.northEast.lat} and longitude from ${bounds.southWest.lng} to ${bounds.northEast.lng}`;

  try {
    const prompt = ` ${locationDescription} between the years ${startYear} and ${endYear}. Focus on key who ruled the area, political events or other events of significance, make it detailed and donot mention coordinates given only give as if a region is given`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",  // fast and good for summaries
      messages: [
        { role: "system", content: "You are a historian who explains clearly and factually." },
        { role: "user", content: prompt }
      ],
      max_tokens: 500lik,
    });

    const reply = completion.choices[0].message.content;
    res.json({ history: reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ history: "Error fetching historical data." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
