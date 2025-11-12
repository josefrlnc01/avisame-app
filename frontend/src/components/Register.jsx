
import { app,auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth'

export default function Register() {
  
  async function loginGoogle(){
    try {
      // Iniciar sesión con Google
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Obtener credenciales y datos del usuario
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const user = result.user;
      
      if (!credential) {
        throw new Error('No se pudieron obtener las credenciales de Google');
      }
      
      const token = credential.accessToken || '';

      console.log('Usuario de Google:', user);
      console.log('Token de acceso:', token);
      
      const userData = {
        email: user.email,
        name: user.displayName,
      };
      
      // Enviar datos al servidor
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials : 'include',
        body: JSON.stringify({ userData, token })
      });
      
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${response.status} - ${errorText}`);
      }
      
      // Intentar parsear la respuesta como JSON
      let data;
      try {
        data = await response.json();

        if (data.tokens) {
          localStorage.setItem('accessToken', data.tokens.accessToken);
          localStorage.setItem('refreshToken', data.tokens.refreshToken);
        }
        console.log('userResponseData', data)
      } catch (jsonError) {
        console.error('Error al parsear la respuesta JSON:', jsonError);
        throw new Error('La respuesta del servidor no es un JSON válido');
      }
      
      console.log('Respuesta del servidor:', data);
      
      if (data && data.success) {
        // Guardar información de autenticación
     
          
        localStorage.setItem('isAuth', 'true');
        
        
       
        window.location.reload()
      } else {
        throw new Error(data?.message || 'Error en la autenticación');
      }
      
    } catch (error) {
      console.error('Error en loginGoogle:', error);
      // Mostrar mensaje de error al usuario
      alert(`Error al iniciar sesión: ${error.message}`);
    }
  }

  return (
    <div className='min-w-dvw min-h-dvh fixed bg-black z-10'>
     <form onSubmit={(e) => {e.preventDefault(); loginGoogle()}}>
      <button className='bg-black w-3xs' type="submit">Login with Google</button>
     </form>
    </div>
  );
}