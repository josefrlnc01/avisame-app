import { createContext, useContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
    const [articles, setArticles] = useState([]);
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
            setArticles(Array.isArray(data) ? data : []);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching articles:', error);
            setArticles([]);
        }
    };
    
    // Efecto para la actualización automática
    useEffect(() => {
        // Obtener artículos al cargar
        fetchArticles();
        
        // Configurar actualización automática cada minuto
        const interval = setInterval(() => {
            fetchArticles();
        }, 60000); // 60 segundos
        
        // Limpiar intervalo al desmontar
        return () => clearInterval(interval);
    }, []);
    
    const clearArticles = async () => {
        try {
            console.log('Sending clear request to:', `${API_BASE_URL}/api/clear`);
            const response = await fetch(`${API_BASE_URL}/api/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({}) // Empty body for POST request
            });
            
            console.log('Clear response status:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server response error:', errorText);
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Clear response:', data);
            setArticles([]);
        } catch (error) {
            console.error('Error in clearArticles:', error);
            // Still clear the local state even if server request fails
            setArticles([]);
        }
    };

    return (
        <ThemeContext.Provider value={{ articles, fetchArticles, clearArticles }}>
            {children}
        </ThemeContext.Provider>
    );
}