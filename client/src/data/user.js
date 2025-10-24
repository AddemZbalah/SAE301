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
    if (userInfo.newPassword && userInfo.newPassword.trim() !== '') {
      updateData.currentPassword = userInfo.currentPassword;
      updateData.newPassword = userInfo.newPassword;
    }
    return await jsonPatchRequest("users", updateData);
  }
};

// Ajoute la fonction getCurrent à l'objet UserData
UserData.getCurrent = function() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

export { UserData };