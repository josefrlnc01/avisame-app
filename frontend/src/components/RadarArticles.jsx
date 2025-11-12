import { addArticle } from "../services/ArticlesSavedsService";
import { useEffect, useState, useMemo } from "react";

import { useThemeStore } from "../stores/ThemeStore";


export default function RadarArticles() {
    const setThemes = useThemeStore((state) => state.setThemes)
    const [newArticles, setNewArticles] = useState([]);
    const themes = useThemeStore((state) => state.themes)
    const normalizedThemes = themes.map(objeto => [objeto.interest]).flat()
    const memoizedThemes = useMemo(() => normalizedThemes, [normalizedThemes.join(',')])
    const [theme, setTheme] = useState('')
    const [filteredArticles, setFilteredArticles] = useState([])
  
    const haveArticles = useMemo(() => newArticles.length > 0, [newArticles])
    const haveFilteredArticles = useMemo(() => filteredArticles.length > 0, [filteredArticles])
    const [articles, setArticles] = useState([])
    const isAuthAtStorage = localStorage.getItem('isAuth')
    const saveArticle = (article) => {
        console.log(article)
        addArticle(article)
    }
    async function handleTheme (e) {
        console.log(e.target.value)
        try{
            const value = e.target.value
        setTheme(value)
           
        } catch (error) {
            console.error(error)
        }
        
    }

    useEffect(() => {
  if (theme) {
    setFilteredArticles(newArticles.filter(article => article.topic === theme))
  } else {
    setFilteredArticles([])
  }
}, [theme, newArticles])


    
    
    
    
    useEffect(() => {
        
        if (haveFilteredArticles){
            
            setArticles(filteredArticles)
        } else {
            
            setArticles(newArticles)
        }
    }, [filteredArticles, newArticles])
   
   
    

    useEffect(() => {
        
        const loadThemes = async () => {
            try{
                await setThemes()
            }catch(error){
                console.error('Error fetching themes:', error)
            }
        }
       
       
         loadThemes()
    }, [setThemes])


    useEffect(() => {
          if (!normalizedThemes?.length) return;

  
  const eventSource = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/updates?themes=${encodeURIComponent(JSON.stringify(normalizedThemes))}`, {
    withCredentials : true
  });

  const handleMessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(data);

      if (data.type === 'initial') {
        setNewArticles(data.articles);
      }
      // puedes manejar otros tipos si los necesitas
    } catch (err) {
      console.error('Error parsing SSE data:', err);
    }
  };

  const handleError = (err) => {
    console.error('SSE error:', err);
    eventSource.close();
  };

  eventSource.onmessage = handleMessage;
  eventSource.onerror = handleError;

  return () => {
    eventSource.close(); // cleanup cuando el componente se desmonte o cambie normalizedThemes
  };
    },[memoizedThemes, isAuthAtStorage])


    

   

  
    return (
        <section className="w-full max-w-4xl mt-2 mx-auto">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 text-center">Artículos en base a tus intereses</h2>
            {haveArticles && (
                <>
                <select onChange={handleTheme} className="w-full chevron p-3 border mb-3  border-gray-300 bg-blue-400 text-white rounded-lg uppercase">
                <option value="">Selecciona un tema</option>
                 {themes.map((theme) => (
        <option key={theme.interest_id} value={theme.interest}>
            {theme.interest}
        </option>
    ))}
            </select>
            {haveFilteredArticles && <p className="text-black mb-4">Número de artículos relacionados: {filteredArticles.length}</p>}
            </>
            )}
            <div className="h-full bg-transparent rounded-lg  overflow-hidden flex flex-col gap-3 ">
                {newArticles && newArticles.length > 0 ? (
                  <>
                        {articles.map((article) => (
                              <div
                              key={article.id}
                              className=" bg-white border border-gray-100 shadow-md rounded-xl p-5 relative">
                                 {article.topic && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                                        {article.topic.toUpperCase()}
                                    </span>
                                )}
                                 <button
                                        onClick={() => saveArticle(article)}
                                        className="absolute bottom-2 right-2 px-4 py-1 border border-transparent text-xs font-medium rounded-3xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        title="Guardar artículo"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </button>
                            <a
                                
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full hover:bg-gray-50 transition-colors duration-200"
                            >
                                <h3 className="text-md font-medium text-gray-900 mb-1 ">
                                    {article.title.split('-')[0]}
                                </h3>
                               
                                {article.creationDate && (
                                    <p className="text-xs text-gray-500 mb-3">
                                        {new Date(article.creationDate).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                )}
                            </a>
                            
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="p-6 text-center">
                        <p className="text-gray-500">No hay artículos recientes para mostrar.</p>
                    </div>
                )}
            </div>
        </section>
    );
}