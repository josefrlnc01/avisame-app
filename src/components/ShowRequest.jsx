
import { useTheme } from "../../context/ThemeContext";

export default function ShowRequest() {
    const {articles} = useTheme()
  
 
    
   return (
  <div className="w-full flex flex-col p-3">
    <h2 className="text-gray-700 font-bold mb-3">Noticias</h2>
    {articles.length === 0 ? (
      <p>No hay artículos para mostrar. Realiza una búsqueda primero.</p>
    ) : (
      <>
      <ul className="w-full">
        {articles.map((article, index) => (
          <div className="d-flex bg-white p-4 mb-2 rounded shadow-sm w-full" key={index}>
            <li key={index} className="text-decoration-none">
              <p className="text-sm text-blue-500 font-medium"> {article.topic}</p>
            <a href={article.link} target="_blank" className="text-decoration-none font-bold text-black text-sm" rel="noopener noreferrer">
              {article.title}
            </a>
           
          </li>
          </div>
          
        ))}
      </ul>
    
      </>
    )}
  </div>
);
}