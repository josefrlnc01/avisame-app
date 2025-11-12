import { useEffect } from "react";
import { deleteArticle } from "../services/ArticlesSavedsService";
import { useTheme } from "../context/ThemeContext";



export default function ShowSaveds() {
    const { storagedArticles, setStoragedArticles } = useTheme();
    console.log(storagedArticles)

    const deleteById = (articleId) => {
        const newList = storagedArticles.filter(article => article.id !== articleId)
        deleteArticle(articleId)
        setStoragedArticles(newList)
    }
    const getArticlesSaveds = async () => {
        try{
            const theme = 'saveds'
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveds?theme=${theme}`, {
            credentials : 'include'
        })
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.success) {
            setStoragedArticles(Array.isArray(data.articlesSaveds) ? data.articlesSaveds : []);
        }
        }
        catch (error) {
            console.error(error)
        }
        
        
        
    }
    useEffect(() => {
        getArticlesSaveds()
    }, [])
   



    return (

        <aside className="w-full h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-y-auto scrollbar-hide flex flex-col gap-5  bg-gray-50">


            {storagedArticles.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No hay artículos guardados</h3>
                    <p className="mt-1 text-gray-500">Los artículos que guardes aparecerán aquí.</p>
                </div>
            ) : (
                <div className="w-full flex flex-col justify-center items-center p-6 gap-3">
                    {storagedArticles.map((article, index) => (
                        <div key={article.id} className="bg-white border border-gray-100  overflow-hidden  border-b border-solid shadow-2xs w-full  transition-shadow rounded-xl duration-200">
                            <div className="p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-lg font-bold text-black">{article.topic.toUpperCase()}</p>
                                        {article.creationDate && (
                                            <p className="mt-2 text-sm text-gray-400">
                                                {new Date(article.creationDate).toLocaleDateString('es-ES', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        )}
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-1 text-base font-medium text-black hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {article.title}
                                        </a>
                                        
                                    </div>
                                    <button
                                        onClick={() => deleteById(article.id)}
                                        className="ml-4 inline-flex items-center p-2 border border-transparent text-xs font-medium rounded-4xl shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                        title="Eliminar artículo"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    )
}
