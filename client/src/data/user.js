import { getRequest, jsonPostRequest, deleteRequest, jsonPatchRequest } from "../lib/api-request.js";

const UserData = {
  // Inscription (POST /api/users)
  async signup(data) {
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
    return await jsonPostRequest("auth", data);
  },

  // Vérifier si connecté (GET /api/auth)
  async getCurrentUser() {
    return await getRequest("auth");
  },

  // Déconnexion (DELETE /api/auth)
  async logout() {
    return await deleteRequest("auth");
  },

  // Mettre à jour le profil (PATCH /api/users)
  async update(userInfo) {
    const updateData = {
      prenom: userInfo.prenom,
      nom: userInfo.nom,
      mail: userInfo.mail,
      gender: userInfo.gender
    };

    // Ajouter les mots de passe si fournis
    if (userInfo.newPassword && userInfo.newPassword.trim() !== '') {
      updateData.currentPassword = userInfo.currentPassword;
      updateData.newPassword = userInfo.newPassword;
    }
    
    return await jsonPatchRequest("users", updateData);
  }
};

export { UserData };