const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const SERPAPI_KEY = process.env.SERPAPI_KEY;

// CETTE LIGNE DIT AU SERVEUR D'OUVRIR TON FICHIER PAR DÉFAUT
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'skycompare.html'));
});

// La route pour l'API
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
    res.status(500).json({ error: "Erreur API" });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Serveur sur le port ${PORT}`));
