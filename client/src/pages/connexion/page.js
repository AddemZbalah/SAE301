import { UserData } from "../../data/user.js";
import { htmlToFragment } from "../../lib/utils.js";
import { ConnexionView } from "../../ui/connexion/index.js";
import template from "./template.html?raw";

let C = {};

C.handler_submitForm = async function(ev, router) {
    ev.preventDefault();
    
    const form = ev.target;
    const formData = new FormData(form);
    
    
    const data = {
        mail: formData.get('email'),
        password: formData.get('password')
    };
    
    if (!data.mail || !data.password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    console.log('Données du formulaire:', data);
    
    try {
        const result = await UserData.login(data);
        console.log('Résultat de login:', result);
        console.log('Type de result:', typeof result);
        console.log('result.logged:', result?.logged);
        console.log('result.error:', result?.error);
        
        
        if (result === false) {
            alert('Impossible de se connecter au serveur');
            return;
        }
        
        if (result && result.logged) {
            alert('Connexion réussie !');

            localStorage.setItem("user", JSON.stringify(result.user || result));
            
            
            const redirectPath = sessionStorage.getItem('redirectAfterLogin');
            if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                window.location.href = redirectPath;
            } else {
                window.location.href = '/profil';
            }
        } else {
            const errorMsg = result?.error || 'Email ou mot de passe incorrect';
            console.error('Erreur de connexion:', errorMsg);
            alert(errorMsg);
        }
    } catch (error) {
        console.error('Exception lors de la connexion:', error);
        console.error('Stack trace:', error.stack);
        alert('Erreur lors de la connexion: ' + error.message);
    }
};

C.init = async function(params, router) {
    return V.init(router);
};

let V = {};

V.init = function(router) {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment, router);
    return fragment;
};

V.createPageFragment = function() {
    let pageFragment = htmlToFragment(template);
    let connexionDOM = ConnexionView.dom();
    pageFragment.querySelector('slot[name="connexion"]').replaceWith(connexionDOM);
    return pageFragment;
};

V.attachEvents = function(fragment, router) {
    const form = fragment.querySelector('form');
    if (form) {
        form.addEventListener('submit', (ev) => C.handler_submitForm(ev, router));
    }
};

export function ConnexionPage(params, router) {
    return C.init(params, router);
}