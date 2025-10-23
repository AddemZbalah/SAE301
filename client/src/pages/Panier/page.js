import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { PanierProduitView } from "../../ui/PanierProduit/index.js";

let M = {
    panier: []
};

let C = {};

C.init = function(){
    const donneesPanier = localStorage.getItem('panier');
    M.panier = donneesPanier ? JSON.parse(donneesPanier) : [];
    
    console.log('Panier chargé:', M.panier); // Debug
    
    return V.init();
}

C.gererSuppressionArticle = function(event){
    const idProduit = Number(event.currentTarget.dataset.id);
    M.panier = M.panier.filter(article => article.id !== idProduit);
    localStorage.setItem('panier', JSON.stringify(M.panier));
    
    const nouveauFragment = C.init();
    const conteneurApp = document.querySelector('#app');
    conteneurApp.innerHTML = '';
    conteneurApp.appendChild(nouveauFragment);
}

C.gererDiminutionQuantite = function(event){
    const idProduit = Number(event.currentTarget.dataset.id);
    const element = event.currentTarget.closest('[data-article-panier]');
    const quantiteActuelle = Number(element.querySelector('[data-quantite]').textContent);
    
    if (quantiteActuelle > 1) {
        const article = M.panier.find(item => item.id === idProduit);
        if(article){
            article.quantity = quantiteActuelle - 1;
            localStorage.setItem('panier', JSON.stringify(M.panier));
            element.querySelector('[data-quantite]').textContent = quantiteActuelle - 1;
            V.mettreAJourPrixProduit(element, quantiteActuelle - 1);
            V.mettreAJourPrixTotal();
        }
    }
}

C.gererAugmentationQuantite = function(event){
    const idProduit = Number(event.currentTarget.dataset.id);
    const element = event.currentTarget.closest('[data-article-panier]');
    const quantiteActuelle = Number(element.querySelector('[data-quantite]').textContent);
    
    const article = M.panier.find(item => item.id === idProduit);
    if(article){
        article.quantity = quantiteActuelle + 1;
        localStorage.setItem('panier', JSON.stringify(M.panier));
        element.querySelector('[data-quantite]').textContent = quantiteActuelle + 1;
        V.mettreAJourPrixProduit(element, quantiteActuelle + 1);
        V.mettreAJourPrixTotal();
    }
}

let V = {};

V.analyserPrix = function(chaineTexte){
    return parseFloat(chaineTexte.replace(/\s/g, '').replace(',', '.'));
}

V.formaterPrix = function(nombre){
    return nombre.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

V.attacherEvenements = function(fragment){
    const produits = fragment.querySelectorAll('[data-article-panier]');
    produits.forEach(element => {
        const btnSupprimer = element.querySelector('[data-btn-supprimer]');
        const btnDiminuer = element.querySelector('[data-btn-diminuer]');
        const btnAugmenter = element.querySelector('[data-btn-augmenter]');
        
        if(btnSupprimer) btnSupprimer.addEventListener('click', C.gererSuppressionArticle);
        if(btnDiminuer) btnDiminuer.addEventListener('click', C.gererDiminutionQuantite);
        if(btnAugmenter) btnAugmenter.addEventListener('click', C.gererAugmentationQuantite);
    });
}

V.nombreArticles = function(fragment){
    const nbArticles = M.panier.reduce((sum, item) => sum + item.quantity, 0);
    const compteurPanier = fragment.querySelector('#cart-count');
    if(compteurPanier){
        compteurPanier.textContent = `${nbArticles} article(s)`;
    }
}

V.mettreAJourPrixProduit = function(element, quantite){
    const idProduit = Number(element.dataset.id);
    const produit = M.panier.find(article => article.id === idProduit);
    
    if(produit){
        const prixNombre = typeof produit.price === 'string' ? V.analyserPrix(produit.price) : produit.price;
        const prixTotal = prixNombre * quantite;
        const elementPrix = element.querySelector('[data-prix-produit]');
        if(elementPrix){
            elementPrix.textContent = V.formaterPrix(prixTotal) + ' €';
        }
    }
}

V.mettreAJourTousPrix = function(fragment){
    const produits = fragment.querySelectorAll('[data-article-panier]');
    produits.forEach(element => {
        const quantite = Number(element.querySelector('[data-quantite]').textContent);
        V.mettreAJourPrixProduit(element, quantite);
    });
}

V.mettreAJourPrixTotal = function(fragment){
    const total = M.panier.reduce((somme, article) => {
        const prixNombre = typeof article.price === 'string' ? V.analyserPrix(article.price) : article.price;
        return somme + (prixNombre * (article.quantity || 1));
    }, 0);
    
    const conteneur = fragment || document;
    const elementTotal = conteneur.querySelector('#total');
    
    if(elementTotal){
        elementTotal.textContent = V.formaterPrix(total) + ' €';
    }
}

V.init = function(){
    const fragment = V.creerFragmentPage();
    V.nombreArticles(fragment);
    V.mettreAJourTousPrix(fragment);
    V.mettreAJourPrixTotal(fragment);
    V.attacherEvenements(fragment);
    return fragment;
}

V.creerFragmentPage = function(){
    const fragmentPage = htmlToFragment(template);
    const conteneurArticles = fragmentPage.querySelector('#cart-items');
    const panierVide = fragmentPage.querySelector('#empty-cart');
    
    if (M.panier.length === 0) {
        panierVide.style.display = 'block';
    } else {
        panierVide.style.display = 'none';
        
        // Utiliser PanierProduitView pour créer les articles avec le bon template
        const produitsDOM = PanierProduitView.dom(M.panier);
        conteneurArticles.insertBefore(produitsDOM, panierVide);
    }
    
    return fragmentPage;
}

export function PanierPage(){
    console.log("Panier actuel:", M.panier);
    return C.init();
}