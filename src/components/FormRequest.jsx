import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";

export default function FormRequest() {
    const [theme, setTheme] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const  {fetchArticles, clearArticles} = useTheme()
    async function handleRequest(e) {
        e.preventDefault();
        if (!theme.trim()) {
            alert('Please enter a theme');
            return;
        }
        
        setIsLoading(true);
        console.log('Sending theme:', theme);
        try {
            const response = await fetch('http://localhost:3000/api', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            fetchArticles();
            setTheme('');
            console.log('Response:', data);
            alert(`Successfully processed theme: ${theme}`);
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to process theme. Check console for details.');
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <h1>FormRequest</h1>
            <form className="flex flex-col gap-2 w-full p-2">
                <label className=" text-gray-800" htmlFor="theme">Escribe tus temas favoritos</label>
                <input 
                    type="text" 
                    id="theme" 
                    value={theme}
                    className="border border-gray-300 rounded text-gray-500 p-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setTheme(e.target.value)}
                    placeholder="Ej: Cristiano Ronaldo, Coches Eléctricos, etc"
                />
                <button type="submit" onClick={handleRequest} className="bg-blue-400 w-full text-white p-2 rounded font-bold" disabled={isLoading}>
                    {isLoading ? 'Guardando...' : 'Guardar Tema'}
                </button>
                  <button className="bg-red-500 text-white p-2 rounded" onClick={clearArticles}>Borrar</button>
            </form>
        </div>
    );
}