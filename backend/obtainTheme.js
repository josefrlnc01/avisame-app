const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint para recibir el tema desde el frontend
app.post('/api', async (req, res) => {
  const { topic } = req.body;
  if (!topic) return res.status(400).json({ error: 'Falta el tema' });

  await fetchTopic(topic);
  res.json({ message: `Búsqueda iniciada para ${topic}` });
});

app.listen(3000, () => console.log('Servidor escuchando en http://localhost:3000'));
