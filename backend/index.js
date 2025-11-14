import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });  // Ruta relativa desde index.js
import Parser from 'rss-parser';
import { pipeline } from '@xenova/transformers';
import jwt from 'jsonwebtoken'
import cron from 'node-cron';
import { createDatabase, pool } from './config/db.js';

import 'dotenv/config'
import { createServer } from "http";
import express from 'express'
import bodyParser from "body-parser";
import cors from 'cors';
import router from "./router.js";
import { clients } from './handlers/articles.js';
import cookieParser from 'cookie-parser';
export const app = express();
export const server = createServer(app)
export const port = 3000;



// Configure CORS
export const corsOptions = {
  origin: [
     'capacitor://localhost', // 👈 Para Capacitor iOS
      'http://localhost', // 👈 Para Capacitor Android
      'ionic://localhost', // 👈 Para Ionic/Capacitor
      'https://avisame-app-production.up.railway.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
  exposedHeaders: ['Set-Cookie'],
  credentials: true
};

// Middleware setup (order matters!)
app.use(cookieParser())

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes should be last
app.use(router);

createDatabase()








app.use((req, res, next) => {
  const token = req.cookies.accessToken;
  if (token){
    try {
      jwt.verify(token, process.env.VITE_ACCESS_TOKEN)
    } catch (error) {
      console.error(error)
      res.clearCookie('accessToken', {
        httpOnly : true,
        secure : false,
        sameSite : 'lax'
      })
      res.clearCookie('refreshToken', {
        httpOnly : true,
        secure : false,
        sameSite : 'lax'
      })
    }
  }
  next()
})




// Initialize parser
export const parser = new Parser();
let embedder;


// Initialize model
(async () => {
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
   
  } catch (error) {
    console.error('Error loading model:', error);
  }
})();




export async function fetchTopic(topic, userId) {

  const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=es&gl=ES&ceid=ES:es`;
  const feed = await parser.parseURL(feedUrl);

  const results = []
  for (let item of feed.items.slice(0,10)) {

    const creationDate = item.pubDate
    const title = item.title;
    const link = item.link;
    
    

    const article = {

      title,
      link,
      topic,
      creationDate,
      user_id : userId
    }

    await pool.query(`
        INSERT OR IGNORE INTO articles(title, link, topic, creationDate, user_id) VALUES ($1,$2,$3,$4,$5)
        `, [article.title,
      article.link,
      article.topic,
      article.creationDate,
      article.user_id])

    await pool.query(`
      DELETE FROM articles
      WHERE id NOT IN (
        SELECT id FROM articles
        WHERE user_id = $1
        ORDER BY dateTime(creationDate) DESC
        LIMIT 150
      )
        AND user_id = $2
      `, [userId, userId])

    results.push(article)


  }


  return results

}







let sseClients = [];
// 📡 SSE Endpoint - Los clientes se conectan aquí
app.get('/api/events', (req, res) => {
  // Configurar headers para SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Agregar cliente a la lista
  const clientId = Date.now();
  const newClient = {
    id: clientId,
    res
  };

  sseClients.push(newClient);
  

  // Enviar mensaje de conexión exitosa
  res.write(`event: connected\n`);
  res.write(`data: ${JSON.stringify({ clientId, timestamp: new Date().toISOString() })}\n\n`);

  // Eliminar cliente cuando se desconecta
  req.on('close', () => {
    sseClients = sseClients.filter(client => client.id !== clientId);
  });
});



app.post('/api/generate-recipe', async (req, res) => {
  try {
    const { prompt } = req.body
    
    const result = await streamText({
      model: 'meituan/longcat-flash-chat:free',
      messages: [{ role: 'user', content: prompt }],
      system: 'Eres experto en noticias y siempre tienes la última actualidad de noticias a mano',
      apiKey: process.env.VITE_KEYAI // Secure, server-side only
    })
    
    // Stream the response
    result.pipeTextStreamToResponse(res)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


app.post('/api/refresh', async  (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if(!refreshToken){
    return res.status(401).json({error : 'No hay token'})
  }

  const storedToken = await pool.query(`
    SELECT * FROM users WHERE refresh_token = $1
    `,[refreshToken])

      if (!storedToken) return res.status(403).json({ error: 'Token no válido' })
 
    const decoded = jwt.verify(refreshToken, process.env.VITE_REFRESH_TOKEN)
    const newAccesToken = jwt.sign(
      {id : decoded.id , email : decoded.email},
      process.env.VITE_ACCESS_TOKEN,
      {expiresIn : '15m'}
    )

    if (newAccesToken){
      res
      .cookie('accessToken', newAccesToken, {
        httpOnly : true,
        secure : false,
        sameSite : 'lax',
        maxAge : 15 * 60 * 1000
      })
      .json({succes : true, message: 'New token has send'})
    }

  
})


app.post('/api/logout', async (req, res) => {
    res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .json({succes : true, message : 'Sesión cerrada'})
})






// Tarea programada para verificar noticias cada hora
async function checkForNewArticlesAndNotify() {
  
  try {

    const topics = await pool.query(`SELECT DISTINCT interest, user_id FROM interests`)
    for (const row of topics) {
      const topic = row.interest;
      const userId = row.user_id;
      const newArticles = await fetchTopic(topic, userId);
      if (newArticles.length) {
        notifyClients({ type: 'new-article', topic: topic, articles: newArticles })
      }
    }
    
  } catch (error) {
    console.error('Error in scheduled article check:', error);
  }
}





function notifyClients(data) {
  for (const client of clients) {
    client.res.write(`data : ${JSON.stringify(data)}\n\n`);
  }
}


// Programar la verificación cada hora
cron.schedule('0 * * * *', async () => {
  try {
    await checkForNewArticlesAndNotify();
  } catch (error) {
    console.error('Cron job error:', error);
  }
});


// Iniciar el servidor
server.listen(port, () => {
  

  // Verificar noticias al iniciar
  checkForNewArticlesAndNotify().catch(console.error);
});
