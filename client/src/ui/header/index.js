// import { htmlToFragment } from "../../lib/utils.js";
// import template from "./template.html?raw";

// // HeaderView est un composant statique
// // on ne fait que charger le template HTML
// // en donnant la possibilité de l'avoir sous forme html ou bien de dom
// let HeaderView = {
//   html: function () {
//     return template;
//   },

//   dom: function () {
//     // On crée d'abord le fragment à partir du template
//     const fragment = htmlToFragment(template);

//     // Puis on sélectionne les éléments DANS ce fragment (et non dans le document global)
//     const menuBtn = fragment.querySelector('#menu-btn');
//     const mobileMenu = fragment.querySelector('#mobile-menu');

//     // On vérifie que les éléments existent avant d’ajouter un listener
//     if (menuBtn && mobileMenu) {
//       menuBtn.addEventListener('click', () => {
//         mobileMenu.classList.toggle('hidden');
//       });
//     }

//     // On retourne le fragment prêt à être inséré dans le DOM
//     return fragment;
//   }
// };

// export { HeaderView };

import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let HeaderView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);

    // Sélection des éléments dans le fragment
    const menuBtn = fragment.querySelector('#menu-btn');
    const mobileMenu = fragment.querySelector('#mobile-menu');
    const burgerIcon = fragment.querySelector('#burger-icon');
    const closeIcon = fragment.querySelector('#close-icon');

    // Sécurité : on vérifie que tout existe
    if (menuBtn && mobileMenu && burgerIcon && closeIcon) {
      menuBtn.addEventListener('click', () => {
        // Affiche ou cache le menu
        mobileMenu.classList.toggle('hidden');

        // Alterne les icônes burger et croix
        burgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      });
    }

    // Retour du fragment prêt à être monté
    return fragment;
  }
};

export { HeaderView };
