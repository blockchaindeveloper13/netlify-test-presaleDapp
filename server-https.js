require('dotenv').config();
console.log("DATABASE_URL:", process.env.DATABASE_URL);
const https = require('https');
const fs = require('fs');
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.get('/api/current-time', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json(result.rows[0]); // Örneğin: { now: '2025-04-22T14:30:00.000Z' }
  } catch (error) {
    console.error('Veritabanı hatası:', error);
    res.status(500).json({ error: 'Sunucu hatası' });
  }
});

// SSL sertifika ve anahtar dosyalarının yollarını burada güncelleyin:
const options = {
  cert: fs.readFileSync('/home/ubuntu/solium-presale/src/bsc-presale-site/certs/fullchain.pem'),
  key: fs.readFileSync('/home/ubuntu/solium-presale/src/bsc-presale-site/certs/privkey.pem'),
};


const PORT = process.env.PORT || 8443;
https.createServer(options, app).listen(PORT, '0.0.0.0', () => {
  console.log(`HTTPS sunucu ${PORT} portunda çalışıyor.`);
});
