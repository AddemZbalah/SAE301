import { genericRenderer, htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

let ConnexionView = {
  html: function (data = {}) {
    return genericRenderer(template, data);
  },

  dom: function (data = {}) {
    const fragment = htmlToFragment(ConnexionView.html(data));
    return fragment;
  }
};

export { ConnexionView };