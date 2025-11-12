import { Router } from "express";
import { createUser, getUser } from "./handlers/user.js";
import { verifyToken } from "./utils/verifyToken.js";
import { addInterest, deleteInterest, filterByInterest, generateInterestByAi, getInterests } from "./handlers/interests.js";
import { deleteSaved, getSaveds, saveArticle } from "./handlers/saveds.js";
import { getArticlesByRadar, searchArticles} from "./handlers/articles.js";


const router = Router();

//Usuario
router.post('/api/user', createUser )


router.get('/api/user', 
    verifyToken,
    getUser)





//obtención de intereses
router.get('/api/interests',
    verifyToken,
    getInterests
)
router.post('/api/aiservice',
    generateInterestByAi
)
//agregar interés
router.post('/api/interests',
    verifyToken,
    addInterest
    
)

//Eliminar interés
router.post('/api/interests/clear',
    verifyToken,
    deleteInterest
)

router.get('/api/filterArticles',
    verifyToken,
    filterByInterest
)



//obtención de guardados
router.get('/api/saveds',
    verifyToken,
    getSaveds
)

//guardado de artículo
router.post('/api/saveds', 
    verifyToken, 
    saveArticle
)


//eliminación de artículo guardado
router.delete('/api/saveds',
    deleteSaved
)



router.get('/api/updates',
    getArticlesByRadar
)


router.get('/api/search', 
    searchArticles
)




export default router