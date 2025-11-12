

export async function addArticle(article){
    try{
        
      
        const theme = 'saveds';
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveds?theme=${theme}`, {
            method : 'POST',
            headers : {'Content-Type' : 'application/json'},
            body : JSON.stringify({article}),
            credentials : 'include'
        })

        if(!response.ok){
            throw new Error("Error");
        }

        const data = await response.json();
        console.log('datos de guardado enviados correctamente')
        console.log(data)
        return data
    } catch (error){
        console.error(error)
    }
}

export async function deleteArticle(articleId){
    try{
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/saveds?articleId=${articleId}`, {
            method:'DELETE',
            headers : {'Content-Type' : 'application/json'}
        })
        if(!response.ok){
            throw new Error('Error')
        }
        const data = await response.json();
        
        console.log(data)
    }
    catch(error){
        console.error(error)
    }
}

export async function deleteInterestFromDb(interestId){
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interests/clear`, {
        method : 'POST',
        headers : {'Content-Type' : 'application/json',
    
        },
        body : JSON.stringify({interestId})
    })
    if(!response.ok){
        throw new Error('Error')
    }
    const data = await response.json();
    console.log(data)
}


export async function getThemes (){
    try{
       
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/interests`,{
            method : 'GET',
            credentials : 'include'
        })
        if(!response.ok){
            throw new Error('Error al obtener temas')
        }
        const data = await response.json()
        
        return data.themes;
       
    }
    catch(error){
        console.error(error)
        throw error;
    }
}


