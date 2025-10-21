
import { postRequest } from "../lib/api-request.js";

const UserData = {
  async signup(prenom, nom, email, password, genre) {
    const formulaireData = {
      firstName: prenom,
      lastName: nom,
      email: email,
      password: password,
      gender: genre
    };
    return await postRequest("/register", formulaireData);
  },

  async login(email, password) {
    const formulaireData = {
      email: email,
      password: password
    };
    return await postRequest("/login", formulaireData);
  }
};

export { UserData };
