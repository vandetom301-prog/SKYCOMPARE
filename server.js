const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const SERPAPI_KEY = process.env.SERPAPI_KEY; // On récupérera la clé depuis Render

app.use(express.static('.')); // Sert ton fichier skycompare.html

app.get('/api/search', async (req, res) => {
  try {
    const { departure_id, arrival_id, outbound_date } = req.query;
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: "google_flights",
        departure_id,
        arrival_id,
        outbound_date,
        api_key: SERPAPI_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Erreur lors de l'appel API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur lancé sur le port ${PORT}`));
