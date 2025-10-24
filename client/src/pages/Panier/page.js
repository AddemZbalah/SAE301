import template from "./template.html?raw";
import { PanierData } from "../../data/panier.js";
import { htmlToFragment } from "../../lib/utils.js";
import { PanierProduitView } from "../../ui/PanierProduit/index.js";
import { jsonPostRequest } from "../../lib/api-request.js";
import { UserData } from "../../data/user.js"; // pour récupérer l'utilisateur connecté


let C = {};

C.init = function(){
    let cartItems = PanierData.obtenirPanier();
    return V.init(cartItems);
}

async function handleCheckout() {
    const user = await UserData.getCurrentUser();
    const cartItems = PanierData.obtenirPanier();

    if (!user || !user.id || cartItems.length === 0) {
        alert("Vous devez être connecté et avoir des produits dans le panier !");
        return;
    }

    // Prépare les données à envoyer
    const data = {
        utilisateurId: user.id,
        montantTotal: cartItems.reduce((sum, item) => {
            const priceNumber = typeof item.price === 'string' ? V.parsePrice(item.price) : item.price;
            return sum + (priceNumber * item.quantity);
        }, 0),
        articles: cartItems.map(item => ({
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            unitPrice: typeof item.price === 'string' ? V.parsePrice(item.price) : item.price,
            totalPrice: (typeof item.price === 'string' ? V.parsePrice(item.price) : item.price) * item.quantity
        }))
    };

    // Envoie la commande à l'API
    const result = await jsonPostRequest("commande", data);

    if (result && result.id) {
        // Vide le panier
        PanierData.viderPanier();
        // Redirige vers la page Order
        window.location.href = "/order";
    } else {
        alert("Erreur lors de la validation de la commande !");
    }
}

C.handlerRemoveItem = function(event){
    const productId = Number(event.currentTarget.dataset.id);
    PanierData.retirerDuPanier(productId);
    
    const newFragment = C.init();
    const appContainer = document.querySelector('#app');
    appContainer.innerHTML = '';
    appContainer.appendChild(newFragment);
}

C.handlerDecreaseQuantity = function(event){
    const productId = Number(event.currentTarget.dataset.id);
    const element = event.currentTarget.closest('[data-article-panier]');
    const currentQty = Number(element.querySelector('[data-quantite]').textContent);
    
    if (currentQty > 1) {
        PanierData.modifierQuantite(productId, currentQty - 1);
        element.querySelector('[data-quantite]').textContent = currentQty - 1;
        V.updateProductPrice(element, currentQty - 1);
        V.updateTotalPrice();
    }
}

C.handlerIncreaseQuantity = function(event){
    const productId = Number(event.currentTarget.dataset.id);
    const element = event.currentTarget.closest('[data-article-panier]');
    const currentQty = Number(element.querySelector('[data-quantite]').textContent);
    
    PanierData.modifierQuantite(productId, currentQty + 1);
    element.querySelector('[data-quantite]').textContent = currentQty + 1;
    V.updateProductPrice(element, currentQty + 1);
    V.updateTotalPrice();
}

let V = {};


V.parsePrice = function(priceString){

    return parseFloat(priceString.replace(/\s/g, '').replace(',', '.'));
}


V.formatPrice = function(number){

    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

V.attachEvents = function(fragment){
    let products = fragment.querySelectorAll('[data-article-panier]');
    products.forEach(element => {
        element.querySelector('[data-btn-supprimer]').addEventListener('click', C.handlerRemoveItem);
        element.querySelector('[data-btn-diminuer]').addEventListener('click', C.handlerDecreaseQuantity);
        element.querySelector('[data-btn-augmenter]').addEventListener('click', C.handlerIncreaseQuantity);
    });
}

V.nbItems = function(fragment){
    const cartItems = PanierData.obtenirPanier();
    const nbItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    let cartCounter = fragment.querySelector('#cart-count');
    if(cartCounter){
        cartCounter.textContent = `${nbItems} article(s)`;
    }
}

V.updateProductPrice = function(element, quantity){
    const productId = Number(element.dataset.id);
    const cartItems = PanierData.obtenirPanier();
    const product = cartItems.find(item => item.id === productId);
    
    if(product){
        const priceNumber = typeof product.price === 'string' ? V.parsePrice(product.price) : product.price;
        const totalPrice = priceNumber * quantity;
        element.querySelector('[data-prix-produit]').textContent = V.formatPrice(totalPrice) + ' €';
    }
}

V.updateAllProductsPrices = function(fragment){
    const products = fragment.querySelectorAll('[data-article-panier]');
    products.forEach(element => {
        const quantity = Number(element.querySelector('[data-quantite]').textContent);
        V.updateProductPrice(element, quantity);
    });
}

V.updateTotalPrice = function(fragment){
    const cartItems = PanierData.obtenirPanier();
    const total = cartItems.reduce((sum, item) => {
        const priceNumber = typeof item.price === 'string' ? V.parsePrice(item.price) : item.price;
        return sum + (priceNumber * item.quantity);
    }, 0);
    
    if (fragment) {
        let totalElement = fragment.querySelector('#total');
        console.log("Total price updated:", total);
        if(totalElement){
            totalElement.textContent = V.formatPrice(total) + ' €';
        }
    } else {
        let totalElement = document.querySelector('#total');
        console.log("Total price updated:", total);
        if(totalElement){
            totalElement.textContent = V.formatPrice(total) + ' €';
        }
    }
}

V.init = function(cartItems){
    let fragment = V.createPageFragment(cartItems);
    V.nbItems(fragment);
    V.updateAllProductsPrices(fragment);
    V.updateTotalPrice(fragment);
    V.attachEvents(fragment);

    // Ajoute l'event listener sur le bouton de validation
    setTimeout(() => {
        const checkoutBtn = fragment.querySelector("#checkout-btn");
        if (checkoutBtn) {
            checkoutBtn.addEventListener("click", handleCheckout);
        }
    }, 0);

    return fragment;
}

V.createPageFragment = function(cartItems){
    let pageFragment = htmlToFragment(template);
    let panierVide = pageFragment.querySelector('#empty-cart');
    
    if (cartItems.length === 0) {
        panierVide.style.display = 'block';
    } else {
        panierVide.style.display = 'none';
        let productCartDOM = PanierProduitView.dom(cartItems);
        let cartItemsContainer = pageFragment.querySelector('#cart-items');
        cartItemsContainer.insertBefore(productCartDOM, panierVide);
    }
    
    return pageFragment;
}

export function PanierPage(){
    const cartItems = PanierData.obtenirPanier();
    console.log("Cart items:", cartItems);

    

    

    return C.init();
}