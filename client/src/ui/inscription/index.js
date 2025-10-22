// import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
// import template from "./template.html?raw";
// import { postRequest } from "../../lib/api-request";

// let InscriptionView = {
//   html: function (data = {}) {
//     return genericRenderer(template, data);
//   },

//   dom: function (data = {}) {
//     const fragment = htmlToFragment(InscriptionView.html(data));
//     InscriptionView.attachEvents(fragment);
//     return fragment;
//   },

//   attachEvents: function (fragment) {
//     const form = fragment.querySelector('form');
    
//     if (form) {
//       form.addEventListener('submit', async (ev) => {
//         ev.preventDefault();
//         ev.stopPropagation();
        
//         const formData = new FormData(form);
//         const password = formData.get('password');
//         const confirmPassword = formData.get('confirmPassword');
        
        
//         const userData = new FormData();
//         userData.append('prenom', formData.get('prenom'));
//         userData.append('nom', formData.get('nom'));
//         userData.append('mail', formData.get('mail'));
//         userData.append('password', password);
//         userData.append('gender', formData.get('gender') || '');
        
//         const response = await postRequest('users', userData);
        
//         if (response) {
//           alert('Inscription réussie !');
//           window.location.href = '/connexion';
//         }
//       });
//     }
//   }
// };

// export { InscriptionView };


import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let InscriptionView = {
  html: function (data = {}) {
    return genericRenderer(template, data);
  },

  dom: function (data = {}) {
    const fragment = htmlToFragment(InscriptionView.html(data));
    return fragment;
  }
};

export { InscriptionView };