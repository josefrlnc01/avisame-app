import { Router } from "express";
import { createUser, getUser } from "./backend/handlers/user.js";
import { verifyToken } from "./backend/utils/verifyToken.js";
import { addInterest, deleteInterest, filterByInterest, getInterests } from "./backend/handlers/interests.js";
import { deleteSaved, getSaveds, saveArticle } from "./backend/handlers/saveds.js";
import { getArticlesByRadar, searchArticles} from "./backend/handlers/articles.js";


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