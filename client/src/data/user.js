import { postRequest } from "../lib/api-request.js";

const UserData = {
  async signup(prenom, nom, mail, password, gender) {
    // Créer un FormData (pas de JSON !)
    const formData = new FormData();
    formData.append('prenom', prenom);
    formData.append('nom', nom);
    formData.append('mail', mail);
    formData.append('password', password);
    formData.append('gender', gender);
    
    return await postRequest("users", formData);
  },

  async login(mail, password) {
    const formData = new FormData();
    formData.append('mail', mail);
    formData.append('password', password);
    
    return await postRequest("login", formData);
  }
};

export { UserData };