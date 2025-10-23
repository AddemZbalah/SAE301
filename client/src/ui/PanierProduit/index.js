import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let PanierProduitView = {
  html: function (data) {
    let chaineHtml = '<section id="produits-panier">';
    for (let product of data) {
        console.log('Product dans PanierProduitView:', product); // Debug
        
        let html = template
          .replaceAll('{{id}}', product.id || '')
          .replaceAll('{{name}}', product.name || 'Produit sans nom')
          .replaceAll('{{image}}', product.image || '/assets/image/products/default.jpg')
          .replaceAll('{{price}}', product.price || '0.00')
          .replaceAll('{{quantity}}', product.quantity || 1);
        
        chaineHtml += html;
    }
    return chaineHtml + '</section>';
  },

  dom: function (data) {
    return htmlToFragment(PanierProduitView.html(data));
  }
};

export { PanierProduitView };