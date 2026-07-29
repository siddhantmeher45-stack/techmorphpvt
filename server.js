import express from 'express';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

import handler from './api/contact.js';

const app = express();

app.use(express.json());

// Serve static files from project root
app.use(express.static(path.resolve('./')));

// API route for contact
app.options('/api/contact', (req, res) => handler(req, res));
app.post('/api/contact', (req, res) => handler(req, res));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`TechMorph server running at http://localhost:${PORT}`);
});
