import { htmlToFragment } from "../../lib/utils.js";
import { UserData } from "../../data/user.js";
import template from "./template.html?raw";

let M = {
  user: null
};

let C = {};

C.init = async function(params) {
  try {
    const authData = await UserData.getCurrentUser();
    M.user = authData && authData.logged ? authData : null;
  } catch (error) {
    console.error("Erreur lors du chargement de l'utilisateur:", error);
    M.user = null;
  }
  
  return V.render();
};

let V = {};

V.render = function() {
  let html = template;
  
  const prenom = M.user && M.user.prenom ? M.user.prenom : "Visiteur";
  html = html.replace('{{prenom}}', prenom);
  
  return htmlToFragment(html);
};

export function HomePage(params) {
  return C.init(params);
}