import { UserData } from "../../data/user.js";
import { ProfilView } from "../../ui/profil/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let M = {
    user: null,
    router: null
};

let C = {};

C.handler_logout = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    
    console.log('Déconnexion en cours...'); 
    
    try {
        await UserData.logout();
        console.log('Déconnexion réussie');
        alert('Déconnexion réussie');
        
        window.location.href = '/';
    } catch (error) {
        console.error('Erreur de déconnexion:', error);
        window.location.href = '/';
    }
};

C.handler_updateProfile = async function(ev) {
    ev.preventDefault();
    ev.stopPropagation();

    const prenom = document.querySelector('input[name="prenom"]').value;
    const nom = document.querySelector('input[name="nom"]').value;
    const mail = document.querySelector('input[name="mail"]').value;
    const genderInputs = document.querySelectorAll('input[name="gender"]');
    let gender = M.user.gender;
    

    genderInputs.forEach(input => {
        if (input.checked) {
            gender = input.value;
        }
    });
    
    const currentPassword = document.querySelector('input[name="currentPassword"]').value;
    const newPassword = document.querySelector('input[name="newPassword"]').value;
    

    if (!prenom || !nom || !mail) {
        alert('Veuillez remplir tous les champs obligatoires');
        return;
    }
    

    if (newPassword && !currentPassword) {
        alert('Veuillez entrer votre mot de passe actuel pour changer de mot de passe');
        return;
    }
    
    const data = {
        prenom: prenom,
        nom: nom,
        mail: mail,
        gender: gender
    };
    

    if (newPassword) {
        data.currentPassword = currentPassword;
        data.newPassword = newPassword;
    }
    
    try {
        const result = await UserData.update(data);
        
        if (result && result.success) {
            alert('Profil mis à jour avec succès !');
            M.user = result.user;
            
            window.location.reload();
        } else {
            alert(result.error || 'Erreur lors de la mise à jour');
        }
    } catch (error) {
        console.error('Erreur lors de la mise à jour:', error);
        alert('Erreur lors de la mise à jour du profil');
    }
};

C.init = async function(params, router) {
    try {
        const authData = await UserData.getCurrentUser();
        
        if (!authData || !authData.logged) {
            window.location.href = '/connexion';
            return;
        }
        
        M.user = authData;
        M.router = router;
        
        return V.init();
        
    } catch (error) {
        console.error('Erreur de chargement du profil:', error);
        window.location.href = '/connexion';
        return;
    }
};

let V = {};

V.init = function() {
    let fragment = V.createPageFragment();
    return fragment;
};

V.createPageFragment = function() {
    let pageFragment = htmlToFragment(template);
    let profilDOM = ProfilView.dom(M.user);
    pageFragment.querySelector('slot[name="profil"]').replaceWith(profilDOM);
    V.attachEvents(pageFragment);
    return pageFragment;
};

V.attachEvents = function(fragment) {
    const logoutBtn = fragment.querySelector('#deco-btn');
    console.log('Bouton déconnexion trouvé:', logoutBtn); 
    
    if (logoutBtn) {
        logoutBtn.addEventListener('click', C.handler_logout);
        console.log('Événement click attaché au bouton déconnexion'); 
    } else {
        console.error('Bouton #deco-btn non trouvé dans le fragment!');
    }
    
    const updateBtn = fragment.querySelector('#modi-btn');
    if (updateBtn) {
        updateBtn.addEventListener('click', C.handler_updateProfile);
    }
};

export function ProfilPage(params, router) {
    return C.init(params, router);
}