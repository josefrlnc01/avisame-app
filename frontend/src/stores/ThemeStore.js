import {create} from 'zustand'
import { deleteInterestFromDb, getThemes } from '../services/ArticlesSavedsService'

export const useThemeStore = create((set) => ({
    themes : [],
    setThemes : async () => {
        
        const newThemes = await getThemes()
        set({themes : newThemes})
    },
    deleteInterest : async (interestId) => {
        const themes = await getThemes()
        const newInterests = themes.filter(theme => theme.interest_id !== interestId)
        deleteInterestFromDb(interestId)
        set({themes : newInterests})
    }
})) 