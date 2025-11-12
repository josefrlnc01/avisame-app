import { useState, useCallback, useMemo, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import ShowRequest from "./ShowRequest";
import {themes} from '../data/themes.js'
import { generateInterest } from "../services/AiService.js";


export default function Search() {
    const [theme, setTheme] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setArticlesSearched } = useTheme();
    const [themesForSearch, setThemesForSearch] = useState([])
    const [interests, setInterests] = useState([])
    console.log(import.meta.env.VITE_APIKEYGROQ)
       
   
    useEffect(() => {
        const getInterest = async () => {
            try{
                const data = await generateInterest('tecnología')
                
                console.log(data)
            } catch (error) {
                console.error(error)
            }
        }
          
        getInterest()
    }, [])
        
            
    const handleRequest = useCallback(async (themeToSearch = null) => {
            const searchTerm = themeToSearch || theme;
           
            if (!searchTerm.trim()) {
                alert('Por favor ingresa un tema o selecciona una categoría');
                return;
            }
            
            setIsLoading(true);
         
            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/search?theme=${searchTerm}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                
                if (!response.ok) {
                    throw new Error(`Error HTTP! estado: ${response.status}`);
                }
                
                const data = await response.json();
        
                
                if (data.success && Array.isArray(data.articles)) {
                    
                    setArticlesSearched(data.articles);
                  
                } else {
                    console.error('❌ Formato de respuesta inesperado:', data);
                    setArticlesSearched([]);
                }
               
                
                // Solo actualizamos el tema si se está haciendo una búsqueda manual
                if (!themeToSearch) {
                    setTheme('');
                }
                
               
            } catch (error) {
                console.error('Error:', error);
                setArticlesSearched([]);
            } finally {
                setIsLoading(false);
            }
    }, [theme, setArticlesSearched]);
    
    const searchByCategory = useCallback((category) => {
        handleRequest(category);
    }, [handleRequest]);

    useEffect(() => {
        const loadAllThemes = async () => {
        try {
               
                setThemesForSearch(themes)
                
            
        } catch (error) {
            console.error(error)
        }
    
    }
    loadAllThemes()
    }, [])
    
 
    const debouncedSearch = useMemo(() => {
        let timeoutID;
        return (searchTerm) => {
            if (timeoutID) {
                clearTimeout(timeoutID);
            }
            timeoutID = setTimeout(() => {
                if (searchTerm && searchTerm.trim()) {
                    handleRequest(searchTerm);
                }
            }, 500);
        };
    }, [handleRequest]);

    return (
         <aside className="w-full h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-5 p-2 pt-1 bg-gray-50 scrollbar-hide ">
          
               
                <div className="relative">
                    <input 
                        type="text" 
                        id="theme" 
                        value={theme}
                        disabled={isLoading}
                        className="w-full mt-2 border border-gray-300 rounded-4xl bg-gray-300 text-gray-800 p-4 placeholder-gray-400 focus:outline-none focus:ring-2 disabled:opacity-50"
                        onChange={(e) => {
                            setTheme(e.target.value)
                            debouncedSearch(e.target.value)
                        }}
                        placeholder="Buscar noticias"
                    />
                    {isLoading && (
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                        </div>
                    )}
                </div>
                <nav className="w-full flex gap-2 h-full overflow-x-auto scrollbar-hide">
                   
                    <ul className="flex gap-2">
                        {themesForSearch.map(thm => (
                            <li
                            key={thm.id}
                        onClick={() => !isLoading && searchByCategory(`${thm.name}`)}
                        className={`shadow-sm flex justify-center items-center rounded-4xl h-2/3 min-w-fit p-4 text-sm text-pretty bg-gray-300 focus:'text-blue-500'${!isLoading ? 'cursor-pointer hover:bg-gray-400' : 'opacity-50 cursor-not-allowed' }`}>
                            {thm.name}
                        </li>
                        ))}
                            
                       
                   
                    </ul>
                </nav>
               
            <ShowRequest/>
        </aside>
    )
}