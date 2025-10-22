// import { postRequest } from "../lib/api-request.js";

// const UserData = {


//   async signup(prenom, nom, mail, password, gender) {

//     const formData = new FormData();
//     formData.append('prenom', prenom);
//     formData.append('nom', nom);
//     formData.append('mail', mail);
//     formData.append('password', password);
//     formData.append('gender', gender);
    
//     return await postRequest("users", formData);
//   },

//   async login(mail, password) {
//     const formData = new FormData();
//     formData.append('mail', mail);
//     formData.append('password', password);
    
//     return await postRequest("login", formData);
//   }
// };


// export { UserData };

import { getRequest, jsonPostRequest, deleteRequest } from "../lib/api-request.js";

const UserData = {
  // Inscription (POST /api/users)
  async signup(data) {
    // data = { prenom, nom, mail, password, gender }
    const genderShort = data.gender === 'male' ? 'M' : 'F';
    
    const userData = { 
      prenom: data.prenom, 
      nom: data.nom, 
      mail: data.mail, 
      password: data.password, 
      gender: genderShort,
    };
    
    return await jsonPostRequest("users", userData);
  },

  // Connexion (POST /api/auth)
  async login(data) {
    // data = { mail, password }
    return await jsonPostRequest("auth", data);
  },

  // Vérifier si connecté (GET /api/auth)
  async getCurrentUser() {
    return await getRequest("auth");
  },

  // Déconnexion (DELETE /api/auth)
  async logout() {
    return await deleteRequest("auth");
  }
};

export { UserData };