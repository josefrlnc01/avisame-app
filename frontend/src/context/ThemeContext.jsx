import { createContext, useContext, useState } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
    
    const initialState = {
        home : true,
        search : false,
        saveds : false,
        profile : false,
    }
    
    
    const [appState, setAppState] = useState(initialState);
    const [articlesSearched, setArticlesSearched] = useState([]);
    const [storagedArticles, setStoragedArticles] = useState([])
    
    const [lastUpdate, setLastUpdate] = useState(new Date());
    
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
    
    // Función para obtener los artículos
    const fetchArticles = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const data = await res.json();
            setArticlesSearched(Array.isArray(data) ? data : []);
            
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticlesSearched([]);
        }
    };
    
    
    
    const clearArticles = async () => {
        try {
            
           
            setArticlesSearched([]);
           
            
            
        } catch (error) {
            console.error('Error in clearArticles:', error);
            // Still clear the local state even if server request fails
            setArticlesSearched([]);
        }
    };




    return (
        <ThemeContext.Provider value={{ articlesSearched, setArticlesSearched, fetchArticles, clearArticles, appState, setAppState, storagedArticles, setStoragedArticles }}>
            {children}
        </ThemeContext.Provider>
    );
}