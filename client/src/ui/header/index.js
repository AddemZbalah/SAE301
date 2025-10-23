
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let HeaderView = {
  html: function () {
    return template;
  },

  dom: function () {
    const fragment = htmlToFragment(template);


    const menuBtn = fragment.querySelector('#menu-btn');
    const mobileMenu = fragment.querySelector('#mobile-menu');
    const burgerIcon = fragment.querySelector('#burger-icon');
    const closeIcon = fragment.querySelector('#close-icon');


    if (menuBtn && mobileMenu && burgerIcon && closeIcon) {
      menuBtn.addEventListener('click', () => {

        mobileMenu.classList.toggle('hidden');

        burgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
      });
    }

    return fragment;
  }
};

export { HeaderView };
