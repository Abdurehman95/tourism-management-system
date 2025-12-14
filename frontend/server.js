// CommonJS-friendly server (no ESM/config needed). Uses dynamic import for node-fetch v3.
const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/api/payments/chapa/create', async (req, res) => {
  try {
    if (!process.env.CHAPA_SECRET_KEY) {
      return res.status(500).send('Server missing CHAPA_SECRET_KEY env var');
    }
    const payload = req.body; // amount, currency, email, first_name, last_name, tx_ref, return_url, callback_url, meta
    const chapaRes = await fetch('https://api.chapa.co/v1/transaction/initialize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const data = await chapaRes.json();
    if (!chapaRes.ok || data.status !== 'success') {
      return res.status(400).send(data.message || 'Chapa init failed');
    }
    res.json({ checkout_url: data.data.checkout_url, tx_ref: data.data.tx_ref });
  } catch (err) {
    res.status(500).send(err.message || 'Server error');
  }
});

app.get('/api/payments/chapa/verify/:txRef', async (req, res) => {
  const { txRef } = req.params;
  try {
    if (!process.env.CHAPA_SECRET_KEY) {
      return res.status(500).send('Server missing CHAPA_SECRET_KEY env var');
    }
    const verifyRes = await fetch(`https://api.chapa.co/v1/transaction/verify/${txRef}`, {
      headers: { Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}` }
    });
    const data = await verifyRes.json();
    if (!verifyRes.ok || data.status !== 'success') {
      return res.status(400).send(data.message || 'Verify failed');
    }
    // TODO: mark payment confirmed in your datastore here
    res.json(data.data);
  } catch (err) {
    res.status(500).send(err.message || 'Server error');
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on ${PORT}`));
