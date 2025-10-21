import { htmlToFragment } from "../../lib/utils";
import template from "./template.html?raw";

const InscriptionView = {

  async dom(){
    const fragment = htmlToFragment(template);
    const form = fragment.querySelector("form");

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
    });

    const prenom = form.firstName.value;
    const nom = form.lastName.value;
    const mail = form.email.value;
    const password = form.password.value;
    const genre = form.genre.value;

    console.log("Inscription:", { prenom, nom, email, password, genre });

    const resultat = await AuthentificationData.signup(prenom, nom, email, password, genre);
    console.log("Résultat de l'inscription :", resultat);

    if (resultat && resultat.id) {
      alert("Inscription réussie !");

    }else{
      alert("Échec de l'inscription. Veuillez réessayer.");
    }
    
    return fragment;
  } 
};
