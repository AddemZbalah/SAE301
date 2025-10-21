import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";
import { GalleryImageView } from "../galleryimage/index.js";

let DetailView = {
  html: function (data) {
    return genericRenderer(template, data);
  },

  dom: function (data) {
    const fragment = htmlToFragment(DetailView.html(data));
    
    if (data.images?.length > 0) {
      const galerieDOM = GalleryImageView.dom({ images: data.images });
      // Chercher le slot par son attribut name plutôt que par id
      const slot = fragment.querySelector('slot[name="image-galerie-slot"]');
      if (slot) {
        console.log('Slot found, replacing with gallery'); // Debug
        slot.replaceWith(galerieDOM);
      } else {
        console.log('Slot not found'); // Debug
      }
    }
    
    return fragment;
  }
};

export { DetailView };
