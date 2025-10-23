import { UserData } from "../../data/user.js";
import { InscriptionView } from "../../ui/inscription/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let C = {};

C.handler_submitForm = async function(ev) {
    ev.preventDefault();
    
    const form = ev.target;
    const formData = new FormData(form);
    
    
    const data = {
        prenom: formData.get('firstName'),
        nom: formData.get('lastName'),
        gender: formData.get('gender'),
        mail: formData.get('email'),
        password: formData.get('password')
    };
    
    if (!data.prenom || !data.nom || !data.gender || !data.mail || !data.password) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    console.log('Données du formulaire:', data);
    
    try {
        const result = await UserData.signup(data);
        console.log('Inscription réussie:', result);
        
        if (result && result.logged) {
            alert('Inscription réussie ! Vous êtes maintenant connecté.');
            window.location.href = '/profil';
        } else if (result && result.error) {
            alert(result.error);
        } else {
            alert('Inscription réussie ! Veuillez vous connecter.');
            window.location.href = '/connexion';
        }
        
    } catch (error) {
        console.error('Erreur lors de l\'inscription:', error);
        alert('Une erreur est survenue lors de l\'inscription');
    }
};

C.init = function() {
    return V.init();
};

let V = {};

V.init = function() {
    let fragment = V.createPageFragment();
    V.attachEvents(fragment);
    return fragment;
};

V.createPageFragment = function() {
    let pageFragment = htmlToFragment(template);
    let inscriptionDOM = InscriptionView.dom();
    pageFragment.querySelector('slot[name="inscription"]').replaceWith(inscriptionDOM);
    return pageFragment;
};

V.attachEvents = function(fragment) {
    const form = fragment.querySelector('form');
    if (form) {
        form.addEventListener('submit', C.handler_submitForm);
    }
};

export function InscriptionPage(params) {
    return C.init();
}