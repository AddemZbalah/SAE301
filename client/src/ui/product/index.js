import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { PanierData } from "../../data/panier.js";

let ProductView = {
  html: function (data) {
    let htmlString =
      '<div class="grid grid-cols-1 place-content-center md:grid-cols-2 lg:grid-cols-3 gap-x-15 gap-y-15 px-8 md:px-12 gap-x-30 lg:px-16 ">';
    for (let obj of data) {
      let image = `/assets/image/products/${obj.images[0]}`;
      obj.image = image;
      htmlString += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    const fragment = htmlToFragment(ProductView.html(data));
    
    const addToCartButtons = fragment.querySelectorAll('[data-add-to-cart]');
    addToCartButtons.forEach(button => {
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        event.stopPropagation();
        
        const productId = Number(button.dataset.productId);
        const product = data.find(p => p.id === productId);
        
        if (product) {
          await PanierData.ajouterAuPanier(product);
          alert('Produit ajouté au panier !');
        }
      });
    });
    
    return fragment;
  }

};

export { ProductView };