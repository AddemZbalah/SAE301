import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import renderImageGalerie from "../galleryimage/index.js";

let DetailView = {
  html: function (data) {
    let image = `/assets/image/products/${data.images[0]}`;
    let htmlContent = template;
    htmlContent = htmlContent.replace("{{image}}", image);
    return genericRenderer(htmlContent, data);
  },
  

  dom: function (data) {
    let fragment = htmlToFragment(DetailView.html(data));

    if (data.images && data.images.length > 0) {
      const galerieDOM = renderImageGalerie({ images: data.images });
      // Remplacer le slot par la galerie
      const slot = fragment.querySelector('slot[name="image-galerie-slot"]');
      if (slot) {
        slot.replaceWith(galerieDOM);
      }

    }
    return fragment;
  }
};

export { DetailView };
