

export async function getUserInfo(){
   
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user`, {
        method : 'GET',
       credentials : 'include'
    })
    if(!response.ok){
        throw new Error('Error al obtener informacion del usuario')
    }
    const data = await response.json()
    return data.user
}