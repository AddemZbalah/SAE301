import { ProductData } from "../../data/product.js";
import { htmlToFragment } from "../../lib/utils.js";
import { DetailView } from "../../ui/detail/index.js";
import template from "./template.html?raw";


let M = {
    products: []
};

M.getProductById = function(id){
    return M.products.find(product => product.id == id);
}


let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Produit ajouté au panier ! (Quand il y en aura un)`);
    }
}

C.init = async function(params) {
    // Récupérer l'ID depuis les paramètres de route
    const productId = params.id;
    
    // Charger le produit depuis l'API
    M.products = await ProductData.fetchAll();
    
    let p = M.getProductById(productId);
    console.log("Product loaded:", p);
    
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
    addToCartBtn.addEventListener('click', C.handler_clickOnProduct);
    return pageFragment;
}

export function ProductDetailPage(params) {
    console.log("ProductDetailPage", params);
    return C.init(params);
}
