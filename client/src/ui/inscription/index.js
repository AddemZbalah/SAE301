

import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let InscriptionView = {
  html: function (data = {}) {
    return genericRenderer(template, data);
  },

  dom: function (data = {}) {
    const fragment = htmlToFragment(InscriptionView.html(data));
    return fragment;
  }
};

export { InscriptionView };