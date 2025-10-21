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
            
            const email = form.querySelector('#email').value.trim();
            const password = form.querySelector('#password').value;
            
            if (!email || !password) {
                alert('Veuillez remplir tous les champs');
                return;
            }
            
            try {
                const response = await UserData.login(email, password);
                
                console.log('Connexion réussie:', response);
                alert('Connexion réussie !');
                
                // Redirection vers la page d'accueil
                window.location.href = '/';
                
            } catch (error) {
                console.error('Erreur lors de la connexion:', error);
                alert(error.message || 'Identifiants incorrects');
            }
        });
    }
}

export function ConnexionPage(params) {
    return C.init();
};