import { useTheme } from "../context/ThemeContext";

export default function Header() {
    
    
    const getTitle = () => {
        if (localStorage.getItem('view') === 'home') return "Nuevas Noticias";
        if (localStorage.getItem('view') === 'search') return "Búsqueda";
        if (localStorage.getItem('view') === 'saveds') return "Artículos Guardados";
        if (localStorage.getItem('view') === 'profile') return "Perfil";
        return "Nuevas Noticias";
    };

    return (
        <header className="h-16 bg-transparent w-full flex justify-center items-center border-b border-slate-300">
            <h1 className="font-bold text-black text-xl text-center">
                {getTitle()}
            </h1>
        </header>
    );
}