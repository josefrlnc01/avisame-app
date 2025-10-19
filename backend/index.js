import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import Parser from 'rss-parser';
import { pipeline } from '@xenova/transformers';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import path from 'path';
import { fileURLToPath } from 'url';
import cron from 'node-cron';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Almacenar los temas a monitorear
let topicsToMonitor = new Set();

const app = express();
const port = 3000;

// Enable CORS for all routes
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.use(bodyParser.json())
// Add a test route
app.get('/test', (req, res) => {
  res.json({ message: 'API is working!' });
});
// Database setup
const file = path.join(__dirname, 'db.json');
const adapter = new JSONFile(file);
const db = new Low(adapter, { interests: [], sent: [] });

// Initialize parser
const parser = new Parser();
let embedder;


// Initialize model
(async () => {
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Modelo cargado ✅');
  } catch (error) {
    console.error('Error loading model:', error);
  }
})();

async function initializeDb(){
  await db.read();
  db.data = db.data || { interests: [], sent: [] };
}

initializeDb().catch(console.error);

async function fetchTopic(topic) {
  await db.read();
  if (!db.data.sent) db.data.sent = [];

  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=es&gl=ES&ceid=ES:es`;
  const feed = await parser.parseURL(feedUrl);

  console.log(`\n🔍 Buscando artículos sobre: ${topic}`);
  const results = []
  for (let item of feed.items) {
    const title = item.title;
    const link = item.link;

    // Evitar duplicados
    if (db.data.sent.includes(link)) break;

    // Embeddings del título y del tema
    const [titleEmb, topicEmb] = await Promise.all([
      embedder(title),
      embedder(topic)
    ]);

    const titleVec = Array.from(titleEmb.data);
    const topicVec = Array.from(topicEmb.data);
    const sim = cosineSimilarity(titleVec, topicVec);

      const article = {title, link, topic}
      db.data.sent.push(article); 
      results.push(article)
      
      
  }
  console.log(`Búsqueda completada para "${topic}".`);
  await db.write();
  return results.slice(0, 10)
  
}

function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  return dot / (magA * magB);
}

// Clear all articles (using POST for better CORS compatibility)
app.post('/api/clear', async (req, res) => {
  try {
    console.log('Clearing articles...');
    await db.read();
    db.data.sent = [];
    await db.write();
    res.json({ success: true, message: 'All articles cleared' });
  } catch (error) {
    console.error('Error clearing articles:', error);
    res.status(500).json({ success: false, message: 'Failed to clear articles' });
  }
});

// API Endpoint para agregar un nuevo tema
app.post('/api', async (req, res) => {
  try {
    const { theme } = req.body;
    if (!theme) {
      return res.status(400).json({ error: 'Theme is required' });
    }
    
    console.log(`Processing topic: ${theme}`);
    const results = await fetchTopic(theme);
    
    // Agregar el tema a la lista de monitoreo
    topicsToMonitor.add(theme.trim().toLowerCase());
    
    res.json(results);
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Get articles endpoint
app.get('/api', async (req, res) => {
  try{
    console.log('GET /api llamado');
    await db.read();
    console.log('DB leída:', db.data);
    res.json(db.data?.sent || []);
  }catch(error){
    console.error('Error fetching articles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Tarea programada para verificar noticias cada hora
async function checkForNewArticles() {
  console.log('Checking for new articles...');
  try {
    for (const topic of topicsToMonitor) {
      console.log(`Checking topic: ${topic}`);
      await fetchTopic(topic);
    }
    console.log('Finished checking for new articles');
  } catch (error) {
    console.error('Error in scheduled article check:', error);
  }
}

// Programar la verificación cada hora
cron.schedule('0 * * * *', checkForNewArticles);
console.log('Scheduled task set to check for new articles every hour');

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  
  // Verificar noticias al iniciar
  checkForNewArticles().catch(console.error);
});
