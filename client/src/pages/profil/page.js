import { UserData } from "../../data/user.js";
import { ProfilView } from "../../ui/profil/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { deleteRequest } from "../../lib/api-request.js";

let M = {
    user: null
};

let C = {};

C.handler_logout = async function(ev) {
    ev.preventDefault();
    
    console.log("Tentative de déconnexion");
    
    const result = await deleteRequest('auth');
    
    console.log("Réponse du serveur:", result);
    
    if (result && result.success) {
        console.log("Session détruite");
        alert('Déconnexion réussie');
        
        window.location.href = '/connexion';
        
    } else {
        alert('Erreur lors de la déconnexion');
    }
};

C.init = async function(params, router) {
    // Vérifier auprès du serveur si connecté
    try {
        const authData = await UserData.getCurrentUser();
        
        if (!authData || !authData.logged) {
            window.location.href = '/connexion';
            return;
        }
        
        M.user = authData;
        return V.init(M.user);
        
    } catch (error) {
        console.error('Erreur de chargement du profil:', error);
        window.location.href = '/connexion';
        return;
    }
};

let V = {};

V.init = function(user) {
    let fragment = V.createPageFragment(user);
    return fragment;
};

V.createPageFragment = function(user) {
    let pageFragment = htmlToFragment(template);
    let profilDOM = ProfilView.dom(user);
    pageFragment.querySelector('slot[name="profil"]').replaceWith(profilDOM);
    
    V.attachEvents(pageFragment);
    
    return pageFragment;
};

V.attachEvents = function(fragment) {
    const logoutBtn = fragment.querySelector('#deco-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', C.handler_logout);
    }
};

export function ProfilPage(params, router) {
    return C.init(params, router);
}