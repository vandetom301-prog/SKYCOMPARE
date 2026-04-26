const express = require('express');
const axios   = require('axios');
const path    = require('path');
const app     = express();

// ─── Clé SerpApi (variable d'environnement Render) ───────────────
const SERPAPI_KEY = process.env.SERPAPI_KEY;

// ─── Servir les fichiers statiques (skycompare.html, etc.) ───────
app.use(express.static(path.join(__dirname)));

// ─── Page principale ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'skycompare.html'));
});

// ─── Route API recherche de vols ─────────────────────────────────
// Accepte tous les paramètres envoyés par le HTML
app.get('/api/search', async (req, res) => {
  try {
    if (!SERPAPI_KEY) {
      return res.status(500).json({ error: 'SERPAPI_KEY manquante sur le serveur.' });
    }

    const {
      departure_id,
      arrival_id,
      outbound_date,
      return_date,
      type,        // "1" = aller-retour, "2" = aller simple
      currency,
      hl,
      stops        // "1" = direct uniquement, "2" = max 1 escale
    } = req.query;

    // Validation minimale
    if (!departure_id || !arrival_id || !outbound_date) {
      return res.status(400).json({ error: 'Paramètres manquants : departure_id, arrival_id, outbound_date sont obligatoires.' });
    }

    // Construction des params SerpApi
    const params = {
      engine:        'google_flights',
      departure_id,
      arrival_id,
      outbound_date,
      type:          type     || '2',       // défaut : aller simple
      currency:      currency || 'EUR',
      hl:            hl       || 'es',
      api_key:       SERPAPI_KEY,
    };

    // Aller-retour → ajouter return_date
    if (type === '1' && return_date) {
      params.return_date = return_date;
    }

    // Filtre escales
    if (stops && stops !== 'all') {
      params.stops = stops;
    }

    console.log(`[SkyCompare] Recherche : ${departure_id} → ${arrival_id} le ${outbound_date}`);

    const response = await axios.get('https://serpapi.com/search.json', { params });

    // On renvoie la réponse complète au frontend
    res.json(response.data);

  } catch (error) {
    const msg = error.response?.data?.error || error.message || 'Erreur inconnue';
    console.error('[SkyCompare] Erreur API:', msg);
    res.status(500).json({ error: msg });
  }
});

// ─── Démarrage ────────────────────────────────────────────────────
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ SkyCompare serveur démarré sur le port ${PORT}`);
  console.log(`   SERPAPI_KEY : ${SERPAPI_KEY ? '✓ présente' : '✗ MANQUANTE !'}`);
});
