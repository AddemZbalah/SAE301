import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let PanierProduitView = {
  html: function (data) {
    let chaineHtml = '<section id="produits-panier" class="flex flex-col gap-6">';
    for (let product of data) {
        console.log(' Produit dans le panier:', product);
        console.log(' Image du produit:', product.image);
        
        let html = template
          .replaceAll('{{id}}', product.id)
          .replaceAll('{{name}}', product.name)
          .replaceAll('{{image}}', product.image || '/assets/image/products/default.jpg') // ✅ Utiliser "image" (singulier)
          .replaceAll('{{price}}', product.price)
          .replaceAll('{{quantity}}', product.quantity);
        
        chaineHtml += html;
    }
    return chaineHtml + '</section>';
  },

  dom: function (data) {
    return htmlToFragment(PanierProduitView.html(data));
  }
};

export { PanierProduitView };