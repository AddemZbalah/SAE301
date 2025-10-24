import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { PanierData } from "../../data/panier.js";

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

    this.updatePanierCount();
    setTimeout(() => PanierData.updateCartBadge(), 0);

    return fragment;
  },

  updatePanierCount: function () {
    const cartCountBadge = document.querySelector('#cart-count-badge');
    
    if (cartCountBadge) {

      const cartItems = PanierData.obtenirPanier();
      const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
      
      cartCountBadge.textContent = count;

      if (count > 0) {
        cartCountBadge.classList.remove('hidden');
        cartCountBadge.classList.add('flex');
      } else {
        cartCountBadge.classList.add('hidden');
        cartCountBadge.classList.remove('flex');
      }
    }
  },
};

export { HeaderView };