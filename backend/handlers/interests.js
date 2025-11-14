
import { pipeline } from '@xenova/transformers';
import { pool } from '../config/db.js';


export const addInterest = async (req, res) => {
    try {
        const { theme } = req.body;
    const user = req.user;
    if (!theme || typeof theme !== 'string' || !theme.trim()) {
      return res.status(400).json({ error: 'Theme is required and must be a non-empty string' });
    }

    if(!user){
      return res.status(400).json({error : 'Error al obtener usuario'})
    }

    await pool.query(`INSERT INTO interests (user_id, interest) VALUES ($1, $2)`,[user.id, theme.trim()])
    // Immediately fetch articles for the new theme
    
    res.status(201).json({
      success: true,
      message: `Successfully added theme: ${theme}`
      
    });
    } catch (error) {
        console.error('Error in /api/interests:', error);
        res.status(500).json({
            error: 'Internal server error',
            details: error.message
        });
    }
}

export const generateInterestByAi = async (req, res) => {
    try {
     
     const {prompt} = req.body;
     if(!prompt){
      return res.status(400).json({error : 'No hay prompt'})
     }
        const generator = await pipeline('text-generation', 'Xenova/gpt2');
        const interests = await generator(
            `Sugiere 5 intereses relacionados con: ${prompt}. Respuesta en formato JSON: {"interests": ["interes1", "interes2"]}`,
            { max_new_tokens: 100 }
        );
      res.status(200).json({success : true, interests})
      

      
  
      
    } catch (error) {
      console.error('Error in generateInterest:', error)
       return res.json({ success: false, error: error.message })
    }
  }

export const deleteInterest = async (req, res) => {
    try {
        const { interestId } = req.body;

        await pool.query(`
          DELETE FROM interests
          WHERE interest_id = $1
          `,[interestId])
          
        return res.json({ success: true, message: 'Interes eliminado correctamente' })
    }
    catch (error) {
        console.error(error)
        return res.json({ success: false, error: error.message })
    }
}


export const getInterests = async (req, res) => {
    try{
        const user = req.user;
        console.log('User Id', user.id)
        const temas = await pool.query(`
          SELECT DISTINCT interest, interest_id
          FROM interests
          WHERE user_id = $1
          `,[user.id])
          
    
          
        return res.json({
          success : true,
          themes : [...temas]
        })
      }
      catch(error){
        console.error(error)
        return res.json({succes : false, error : error.message})
      }
}


export const filterByInterest = async (req, res) => {
  try{
      const {theme} = req.query;
      const user = req.user;
      const filteredArticles = await pool.query(`
        SELECT * FROM articles 
        WHERE user_id = $1
        AND topic = $2
        `, [user.id, theme])
        if(!filteredArticles) throw new Error ('No artículos coincidentes')
      res.json({succes : true, filteredArticles})
    } catch(error){
      console.error(error)
      return res.status(404).json({error : error})
    }
  
}