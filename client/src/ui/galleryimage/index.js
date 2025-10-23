
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

    const firstThumb = thumbnailsContainer.querySelector('.thumbnail');
    if (firstThumb) {
      firstThumb.classList.remove('border-transparent');
      firstThumb.classList.add('border-gray-400');
    }
  }
};

export { GalleryImageView };
