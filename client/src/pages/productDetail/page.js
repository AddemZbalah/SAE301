import { ProductData } from "../../data/product.js";
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

C.handler_clickOnProduct = function(ev){
    ev.preventDefault();
    
    if (ev.target.dataset.buy !== undefined){
        // Récupérer le panier actuel depuis localStorage
        const panier = JSON.parse(localStorage.getItem('panier')) || [];
        
        // Vérifier si le produit est déjà dans le panier
        const produitExistant = panier.find(item => item.id === M.currentProduct.id);
        
        if (produitExistant) {
            // Si le produit existe, augmenter la quantité
            produitExistant.quantity += 1;
        } else {
            // Sinon, ajouter le produit au panier
            panier.push({
                id: M.currentProduct.id,
                name: M.currentProduct.name,
                price: M.currentProduct.price,
                image: M.currentProduct.image,
                quantity: 1
            });
        }
        
        // Sauvegarder le panier dans localStorage
        localStorage.setItem('panier', JSON.stringify(panier));
        
        alert('Produit ajouté au panier !');
    }
}

C.init = async function(params) {
    // Récupérer l'ID depuis les paramètres de route
    const productId = params.id;
    
    // Charger le produit depuis l'API
    M.products = await ProductData.fetchAll();
    
    let p = M.getProductById(productId);
    M.currentProduct = p;
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
    // Attacher un event listener au bouton
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