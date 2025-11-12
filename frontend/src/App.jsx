import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import FormRequest from "./components/FormRequest";
import { useTheme } from "./context/ThemeContext";

import Footer from "./components/Footer";
import Header from "./components/Header";
import ShowSaveds from "./components/ShowSaveds";
import Search from "./components/Search";
import UserProfile from './components/UserProfile';
import Register from './components/Register';
function App() {
  const isAuthAtStorage = localStorage.getItem('isAuth') === 'true';
  const { appState,  newArticles} = useTheme();
  const mainContentRef = useRef(null);
  const prevAppStateRef = useRef(appState);


  useEffect(() => {
    async function refreshToken() {
      try {
       
       
         await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/refresh`, {
          method: 'POST',
          credentials: 'include'
         
        })
           
      }
      catch (error) {
        console.error(error)
      }
    }

    refreshToken()
  }, [])
  useEffect(() => {
    const mainContent = mainContentRef.current || null;

    // Solo animar si el estado ha cambiado
    if (JSON.stringify(prevAppStateRef.current) !== JSON.stringify(appState)) {
      // Animación de salida
      gsap.to(mainContent, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        onComplete: () => {
          // Actualizar el estado anterior
          prevAppStateRef.current = { ...appState };

          // Forzar un re-renderizado para mostrar el nuevo contenido
          gsap.set(mainContent, { opacity: 0, y: -20 });

          // Animación de entrada
          gsap.to(mainContent, {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      });
    }
  }, [appState]);

  // Función para renderizar el contenido actual basado en el estado
  const renderContent = () => {
    if(localStorage.getItem('isAuth') === 'false'){
      return <Register/>
    } else {
      if (localStorage.getItem('view') === 'home') return <FormRequest />;

    if (localStorage.getItem('view') === 'saveds') return <ShowSaveds newArticles={newArticles} />;
    if (localStorage.getItem('view') === 'search') return <Search />;
    if (localStorage.getItem('view') === 'profile') return <UserProfile />;
    }
    

    return null;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Header />

      {renderContent()}

      <Footer />
    </div>
  );
}

export default App
