import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ProductView = {
  html: function (data) {
     let htmlString =
      '<div class="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4 px-4 md:px-6 lg:px-8">';
    for (let obj of data) {
      htmlString  += genericRenderer(template, obj);
    }
    return htmlString + '</div>';
  },

  dom: function (data) {
    return htmlToFragment( ProductView.html(data) );
  }

};

export { ProductView };
