import { useThemeStore } from "../stores/ThemeStore";
import {getUserInfo} from "../services/UserInfo";
import { useEffect, useState, useContext } from "react";
import {signOut} from '@firebase/auth'
import { auth } from "../firebase";
import { useTheme } from "../context/ThemeContext";
export default function UserProfile() {
    
    const name = localStorage.getItem('name')
    const email = localStorage.getItem('email')
    const {themes, setThemes} = useThemeStore()
  
    const deleteInterest = useThemeStore((state) => state.deleteInterest)
   const [userInfo, setUserInfo] = useState({
    name : name,
    email : email
   });
   
   const handleSignOut = async () => {
        signOut(auth)
        .then( async () => {
           
            await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/log-out`, {
                method : 'POST',
                credentials : 'include'
            })
             localStorage.setItem('isAuth', 'false')
            window.location.reload()
            
            
        })
        .catch(error => {
            console.error(error)
            return
        })
   }

   useEffect(() => {
    const loadUserInfo = async () => {
        try{
            const user = await getUserInfo()
            localStorage.setItem('name', user.name)
            localStorage.setItem('email', user.email)
            setUserInfo({
                name : user.name,
                email : user.email
            })
            
        }catch(error){
            console.error(error)
        }
    }
    loadUserInfo()
   }, [])


   useEffect(() => {
        
        const loadThemes = async () => {
            try{
                await setThemes()
            }catch(error){
                console.error('Error fetching themes:', error)
            }
        }
       
       
         loadThemes()
    }, [])
    
    
    return (
        <section className="w-full  h-[calc(100vh-10rem)] max-h-[calc(100vh-10rem)] overflow-y-auto flex flex-col gap-5 p-6">
            <article className="flex flex-col items-center justify-between gap-2">
                <h2 className="text-2xl font-bold text-black">{userInfo.name}</h2>
                <p className="text-blue-300"> {userInfo.email}</p>
            </article>
            <article className="flex flex-col justify-center items-center grow">
                <h3 className="text-black font-bold text-xl">Gestionar temas favoritos</h3>
                <ul className="h-full w-full flex flex-col justify-center  text-black">
                    {themes.map((theme) => (
                        <li key={theme.interest_id} className="text-black p-4 border-b uppercase border-gray-200 flex justify-between">{theme.interest}
                        <button onClick={() => deleteInterest(theme.interest_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
</svg>

                        </button>
                    </li>
                    ))}
                    
                   
                </ul>
            </article>
            <article className="flex flex-col grow">
                <h3 className="text-black font-bold text-xl">Configuración de notificaciones</h3>
              
            </article>
            <footer>
                <button onClick={handleSignOut} className="text-black font-bold text-md bg-gray-300 w-full p-3 rounded-lg">Cerrar sesión</button>
            </footer>
        </section>
    );
}