import { useState } from "react";

import { useTheme } from "../context/ThemeContext";
import RadarArticles from "../components/RadarArticles";
import { useThemeStore } from "../stores/ThemeStore";
export default function FormRequest() {
   const {themes, setThemes} = useThemeStore()
    const [theme, setTheme] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    console.log(theme)
    async function handleRequest(e) {
        e.preventDefault();
        if (!theme.trim()) {
            alert('Please enter a theme');
            return;
        }
        
        setIsLoading(true);
       
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interests`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
                credentials : 'include',
                body: JSON.stringify({ theme })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();

            if(data.success){
                setThemes([...themes, {interest : theme, interest_id : data.interest_id}])
            }
            
            
            setTheme('');
            
            alert(`Successfully processed theme: ${theme}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process theme. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="w-full h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] scrollbar-hide overflow-y-auto flex flex-col gap-5 p-5 pt-7 bg-gray-50">
            <form className="flex flex-col gap-2 w-full ">
                <label className=" text-gray-800" htmlFor="theme">Escribe tus temas favoritos</label>
                <input 
                    type="text" 
                    id="theme" 
                    value={theme}
                    className="border border-blue-200 rounded-xl text-gray-500 p-4 mb-4 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Ej: Cristiano Ronaldo, Coches Eléctricos, etc"
                />
                <button type="submit" onClick={handleRequest} className="bg-blue-400 w-full text-white p-4 rounded-lg   font-bold" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Tema'}
                </button>
                
            </form>
           <RadarArticles/>
        </section>
    );
}