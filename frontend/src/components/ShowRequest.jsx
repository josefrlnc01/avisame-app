import FormRequest from "./FormRequest";
import { useTheme } from "../context/ThemeContext";
import { addArticle } from "../services/ArticlesSavedsService";



export default function ShowRequest() {
    const { articlesSearched = [], clearArticles } = useTheme();
   
    
    
    const saveArticle = (article) => {
        console.log(article)
        addArticle(article);
    }
    
    return (
        <aside className="w-full h-full ">
            
            <div className="flex justify-between items-center mb-6 mt-8 ">
                <h2 className="text-2xl font-bold text-gray-800">Noticias</h2>
                {articlesSearched.length > 0 && (
                    <button
                        onClick={clearArticles}
                        className="inline-flex items-center p-3 border border-transparent text-sm font-medium rounded-2xl shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                    >
                        <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Limpiar búsqueda
                    </button>
                )}
            </div>

            {articlesSearched.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No hay artículos para mostrar</h3>
                    <p className="mt-1 text-gray-500">Realiza una búsqueda para ver los artículos aquí.</p>
                </div>
            ) : (
                <div className="space-y-4 ">
                    {articlesSearched.map((article, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-200">
                            <div className="p-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-blue-600">{article.topic.toUpperCase()}</p>
                                        <a
                                            href={article.link || '#'}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block mt-1 text-base font-semibold text-gray-900 hover:text-blue-600 transition-colors duration-200"
                                        >
                                            {article.title}
                                        </a>
                                       
                                        {article.creationDate && (
                                            <p className="mt-2 text-sm text-gray-500">
                                                {new Date(article.creationDate).toLocaleDateString('es-ES', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => saveArticle(article)}
                                        className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                                        title="Guardar artículo"
                                    >
                                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </aside>
    );
}