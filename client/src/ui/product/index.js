import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProductView = {
  html: function (data) {
     let htmlString =
      '<div class="grid grid-cols-1 place-content-center md:grid-cols-2 lg:grid-cols-3 gap-x-15 gap-y-15 px-8 md:px-12 gap-x-30 lg:px-16 ">';
    for (let obj of data) {
      let image = `/assets/image/products/${obj.images[0]}`;
      obj.image = image;
      htmlString  += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( ProductView.html(data) );
  }

};

export { ProductView };
