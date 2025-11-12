import  {db}  from "../config/db.js";

export const saveArticle = async (req, res) => {
     try {
        const { article } = req.body;
        const user = req.user;
        console.log(article)
        if (!article) {
          return res.status(403).json({ 
            success: false, 
            error: 'No article provided' 
          });
        }
        console.log('👤 User:', user.id);
        db.prepare(`
          INSERT INTO articlesSaveds ( title, link, topic,  creationDate, user_id)
          VALUES (?, ?, ?, ?, ?)
        `).run(
          
          article.title,
          article.link,
          article.topic,
          article.creationDate,
          user.id
        );
    
        res.json({
          success: true,
          article: article
        });
      } catch (error) {
        console.error('Error saving article:', error);
        res.status(500).json({ 
          success: false, 
          error: error.message 
        });
      }
}


export const getSaveds = async (req, res) => {
      try{
         const user = req.user;
      
      const articlesSaveds = db.prepare(`SELECT * FROM articlesSaveds
    WHERE user_id = ?`).all(user.id)
    
        res.json({
          success : true,
          articlesSaveds : articlesSaveds
        })
      }
      catch(error){
        console.error(error);
        res.status(500).json({error : 'Error en el fetching de artículos'})
      }
     
}


export const deleteSaved = async (req, res) => {
     try{
        const {articleId} = req.query;
        console.log('articulo', articleId)
    
         db.prepare(`
          DELETE FROM articlesSaveds
          WHERE id = ?
          `).run(articleId)
           res.json({
          success : true,
          articleId: articleId 
        })
      }
      catch(error){
        console.error(error)
        res.status(500).json({error : 'Error al eliminar el artículo'})
      }
}