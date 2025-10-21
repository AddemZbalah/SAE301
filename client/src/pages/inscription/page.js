import { htmlToFragment } from "../../lib/utils.js";
import { UserData } from "../../data/user.js";
import template from "./template.html?raw";

let M = {};
let V = {};
let C = {};

C.init = function() {
    return V.init();
}

V.init = function() {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function() {
    return htmlToFragment(template);
}

V.attachEvents = function(fragment) {
    const form = fragment.querySelector('form');
    
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Récupérer les valeurs via form.nomDuChamp.value
            const prenom = form.firstName.value.trim();
            const nom = form.lastName.value.trim();
            const gender = form.querySelector('input[name="gender"]:checked')?.value;
            const mail = form.email.value.trim();
            const password = form.password.value;
            
            // Validation simple
            if (!prenom || !nom || !mail || !password || !gender) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                // Appel à la fonction signup
                const result = await UserData.signup(prenom, nom, mail, password, gender);
                
                // Vérifier si l'utilisateur a bien été créé
                if (result && result.id) {
                    alert('Inscription réussie !');
                    window.location.href = '/connexion';
                } else {
                    alert('Erreur lors de l\'inscription');
                }
                
            } catch (error) {
                console.error('Erreur:', error);
                alert('Erreur: ' + error.message);
            }
        });
    }
}

export function InscriptionPage(params) {
    return C.init();
}