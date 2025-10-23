let API_URL = "https://mmi.unilim.fr/~zbalah3/SAE301/api/";

/**
 *  getRequest
 * 
 *  Requête en GET l'URI uri. 
 *  Retourne les données au format JSON converties en objet Javascript.
 */
let getRequest = async function(uri){
    let options = {
        method: "GET",
        credentials: 'include'
    };

    try{
        var response = await fetch(API_URL+uri, options);
    }
    catch(e){
        console.error("Echec de la requête : "+e);
        return false;
    }
    if (response.status != 200){
        console.error("Erreur de requête : " + response.status);
        return false;
    }
    let $obj = await response.json();
    return $obj;
}

/**
 *  postRequest
 * 
 *  Requête en POST avec FormData
 */
let postRequest = async function(uri, data){
    let options = {
        credentials: 'include',
        method: 'POST',
        headers : {
            'Content-Type': 'multipart/form-data'
        },
        body: data
    }

    try{
        var response = await fetch(API_URL+uri, options);
    }
    catch(e){
        console.error("Echec de la requête : " + e);
        return false;
    }
    
    let $obj = await response.json();
    
    if (response.status != 200 && response.status != 201){
        console.error("Erreur de requête : " + response.status, $obj);
        return $obj;
    }
    
    return $obj;
}

/**
 *  jsonPostRequest
 * 
 *  Requête en POST avec JSON
 *  Utilisé pour login, signup, etc.
 */
let jsonPostRequest = async function(uri, data){
    let options = {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }

    try{
        var response = await fetch(API_URL+uri, options);
    }
    catch(e){
        console.error("Echec de la requête : " + e);
        return false;
    }
    
    let $obj = await response.json();
    
    if (response.status != 200 && response.status != 201){
        console.error("Erreur de requête : " + response.status, $obj);
        return $obj;
    }
    
    return $obj;
}

/**
 *  deleteRequest
 * 
 *  Requête en DELETE pour supprimer une ressource ou se déconnecter
 */
let deleteRequest = async function(uri){
    let options = {
        method: "DELETE",
        credentials: 'include'
    };

    try{
        var response = await fetch(API_URL+uri, options);
    }
    catch(e){
        console.error("Echec de la requête : "+e);
        return false;
    }
    if (response.status != 200){
        console.error("Erreur de requête : " + response.status);
        return false;
    }
    let $obj = await response.json();
    return $obj;
}

/**
 *  patchRequest
 * 
 *  Pas implémenté. TODO if needed.
 */
let jsonPatchRequest = async function(uri, data){
     let options = {
       credentials: 'include',
       method: 'PATCH',
       headers: {
           'Content-Type': 'application/json'
       },
       body: JSON.stringify(data)
   };
   try {
       var response = await fetch(API_URL+uri, options);
   } catch (e) {
       console.error("Echec de la requête : " + e);
       return false;
   }
   if (response.status != 200) {
       console.error("Erreur de requête : " + response.status);
       return false;
   }
   let $obj = await response.json();
   return $obj;
}


export {getRequest, postRequest, jsonPostRequest, deleteRequest, jsonPatchRequest}