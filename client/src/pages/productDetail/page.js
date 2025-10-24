import { ProductData } from "../../data/product.js";
import { PanierData } from "../../data/panier.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import template from "./template.html?raw";

let M = {
    products: [],
    currentProduct: null
};

M.getProductById = function(id){
    return M.products.find(product => product.id == id);
}

let C = {};

C.handler_clickOnProduct = async function(ev){
    ev.preventDefault();
    
    if (ev.target.dataset.buy !== undefined){
        console.log('PRODUIT COMPLET:', M.currentProduct);
        console.log('Clés disponibles:', Object.keys(M.currentProduct));
        
        await PanierData.ajouterAuPanier(M.currentProduct);
        
        alert('Produit ajouté au panier !');
    }
}

C.init = async function(params) {
    const productId = params.id;
    M.products = await ProductData.fetchAll();
    let p = M.getProductById(productId);
    M.currentProduct = p;
    console.log("Product loaded:", p);
    console.log("Image du produit chargé:", p.mainImage || p.image || p.imagePrincipale);
    
    return V.init(p);
}

let V = {};

V.init = function(data) {
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function(data) {
    let pageFragment = htmlToFragment(template);
    let detailDOM = DetailView.dom(data);
    pageFragment.querySelector('slot[name="detail"]').replaceWith(detailDOM);
    return pageFragment;
}

V.attachEvents = function(pageFragment) {
    const addToCartBtn = pageFragment.querySelector('[data-buy]');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', C.handler_clickOnProduct);
    }
    return pageFragment;
}

export function ProductDetailPage(params) {
    console.log("ProductDetailPage", params);
    return C.init(params);
}