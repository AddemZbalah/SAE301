// export default function renderImageGalerie({ images }) {
//   const container = document.createElement("div");
//   container.className = "";

//   const mainImage = document.createElement("img");
//   mainImage.src = `/assets/image/products/${images[0]}`;
//   mainImage.className = "object-cover";
//   container.appendChild(mainImage);

//   const gallery = document.createElement("div");
//   gallery.className = "flex gap-2 flex-col absolute top-40 space-x-2 mt-4";

//   images.forEach((img, i) => {
//     const thumb = document.createElement("img");
//     thumb.src = `/assets/image/products/${img}`;
//     thumb.alt = `Miniature ${i + 1}`;
//     thumb.className = "flex flex-col w-16 h-16 object-contain cursor-pointer border-1 border-b";

//     thumb.onclick = () => {
//       mainImage.src = `/assets/image/products/${img}`;
//     };

//     gallery.appendChild(thumb);
//   });

//   container.appendChild(gallery);
//   return container;
// }

import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let GalleryImageView = {
  html: function (data) {
    const templateData = {
      mainImage: data.images[0]
    };
    
    return genericRenderer(template, templateData);
  },

  dom: function (data) {
    const fragment = htmlToFragment(GalleryImageView.html(data));
    GalleryImageView.attachEvents(fragment, data.images);
    return fragment;
  },

  attachEvents: function (fragment, images) {
    const mainImage = fragment.querySelector('#main-image');
    const thumbnailsContainer = fragment.querySelector('#thumbnails-container');
    const thumbnailTemplate = fragment.querySelector('#thumbnail-template');

    images.forEach((img, i) => {
      const thumb = thumbnailTemplate.content.cloneNode(true).querySelector('img');
      thumb.src = `/assets/image/products/${img}`;
      thumb.alt = `Miniature ${i + 1}`;
      thumb.dataset.image = img;

      thumb.addEventListener('click', () => {
        mainImage.src = `/assets/image/products/${img}`;
        
        const allThumbs = thumbnailsContainer.querySelectorAll('.thumbnail');
        allThumbs.forEach(t => {
          t.classList.remove('border-gray-400');
          t.classList.add('border-transparent');
        });
        thumb.classList.remove('border-transparent');
        thumb.classList.add('border-gray-400');
      });

      thumbnailsContainer.appendChild(thumb);
    });

    // Activer la première miniature
    const firstThumb = thumbnailsContainer.querySelector('.thumbnail');
    if (firstThumb) {
      firstThumb.classList.remove('border-transparent');
      firstThumb.classList.add('border-gray-400');
    }
  }
};

export { GalleryImageView };
