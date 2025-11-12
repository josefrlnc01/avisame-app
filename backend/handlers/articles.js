import jwt from 'jsonwebtoken'
import { db } from '../config/db.js';
import Parser from 'rss-parser';
export const clients = new Set();

// Array para mantener las conexiones SSE
export const getArticlesByRadar = async (req, res) => {
    const origin = req.headers.origin || 'http://localhost:5173';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();
  console.log('Todas las cookies',req.cookies)
  const token = req.cookies?.accessToken;
  const { themes } = req.query;
  
  if (!token) {
      res.write(`data: ${JSON.stringify({ type: 'error', message: 'No hay token' })}\n\n`);
  return res.end(); // termina la conexión
  }

  let themesArray;
  try {
    themesArray = JSON.parse(themes);
  } catch {
    themesArray = [themes];
  }
  console.log(themesArray)
  console.log(themes)

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.VITE_ACCESS_TOKEN);
  } catch {
    res.write(`data: ${JSON.stringify({ type: 'error', message: 'Token no válido' })}\n\n`);
  return res.end();
  }

  const userId = decoded.id;

  

  if (!Array.isArray(themesArray) || themesArray.length === 0) {
    res.write(`data: ${JSON.stringify({ type: 'initial', articles: [] })}\n\n`);
  } else {
    const mappedArray = themesArray.map(() => '?').join(',');
    const existingArticles = db.prepare(`
      SELECT * FROM articles
      WHERE user_id = ? 
      AND topic IN (${mappedArray})
      ORDER BY dateTime(creationDate) DESC
      LIMIT 75
    `).all(userId, ...themesArray);

    db.prepare(`
      DELETE FROM articles
      WHERE topic NOT IN (${mappedArray})
      AND user_id = ?
    `).run(...themesArray, userId);

    res.write(`data: ${JSON.stringify({ type: 'initial', articles: existingArticles })}\n\n`);
  }

  const client = { res };
  clients.add(client);

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping' })}\n\n`);
  }, 30000);

  req.on('close', () => {
    clearInterval(interval);
    clients.delete(client);
  });
}



const parser = new Parser({customFields : {item : ['media:content', 'enclosure']}})
async function fetchTopicForSearch(topic) {
    const feedUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(topic)}&hl=es&gl=ES&ceid=ES:es`;
    const feed = await parser.parseURL(feedUrl);

    if (!feed || !feed.items || feed.items.length === 0) return []
  
    const results = []
    for (let item of feed.items) {
      const creationDate = item.pubDate;
      const title = item.title;
      const link = item.link;
     
    
      const article = {
        title,
        link,
        topic,
     
        creationDate
      };

      results.push(article);
    }
    return results;
}




export const searchArticles = async (req, res) => {
    try {
        const { theme } = req.query;

        if (!theme) {
          return res.status(400).json({ error: 'Theme is required' });
        }
        const results = await fetchTopicForSearch(theme);
    
        res.json({
          success: true,
          articles: Array.isArray(results) ? results : [],
          theme: theme
        });
      } catch (error) {
        console.error('❌ Error searching articles:', error);
        res.status(500).json({ success: false, message: 'Failed to search articles', error: error.message });
      }

}