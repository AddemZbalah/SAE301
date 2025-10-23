let PanierData = {};

// Ajouter un produit au panier
PanierData.ajouterAuPanier = async function(produit){
    console.log('🔍 Produit reçu:', produit); // Debug
    
    // Récupérer le panier actuel depuis localStorage
    let panier = localStorage.getItem('panier');
    let tableauPanier = panier ? JSON.parse(panier) : [];
    
    // Chercher si le produit existe déjà dans le panier
    const indexProduitExistant = tableauPanier.findIndex(article => article.id === produit.id);
    
    if (indexProduitExistant !== -1) {
        // Si le produit existe, augmenter sa quantité
        tableauPanier[indexProduitExistant].quantity += 1;
    } else {
        // Créer le nouveau produit avec l'image
        const nouveauProduit = {
            id: produit.id,
            name: produit.name || produit.nom,
            price: produit.price || produit.prix,
            image: produit.image || produit.image || '/assets/image/products/default.jpg',
            description: produit.description || '',
            quantity: 1
        };
        
        console.log('✅ Nouveau produit créé:', nouveauProduit); // Debug
        console.log('✅ Image stockée:', nouveauProduit.image); // Debug
        
        tableauPanier.push(nouveauProduit);
    }
    
    // Sauvegarder le panier mis à jour
    localStorage.setItem('panier', JSON.stringify(tableauPanier));
    console.log('💾 Panier sauvegardé:', tableauPanier); // Debug
    
    return tableauPanier;
}

// Fonction pour obtenir le panier complet
PanierData.obtenirPanier = function() {
    let panier = localStorage.getItem('panier');
    return panier ? JSON.parse(panier) : [];
}

// Fonction pour vider le panier
PanierData.viderPanier = function() {
    localStorage.removeItem('panier');
    return [];
}

// Fonction pour retirer un produit
PanierData.retirerDuPanier = function(idProduit) {
    let tableauPanier = this.obtenirPanier();
    tableauPanier = tableauPanier.filter(article => article.id !== Number(idProduit));
    localStorage.setItem('panier', JSON.stringify(tableauPanier));
    return tableauPanier;
}

// Fonction pour modifier la quantité
PanierData.modifierQuantite = function(idProduit, quantite) {
    let tableauPanier = this.obtenirPanier();
    const indexProduit = tableauPanier.findIndex(article => article.id === idProduit);
    
    if (indexProduit !== -1) {
        if (quantite <= 0) {
            tableauPanier.splice(indexProduit, 1);
        } else {
            tableauPanier[indexProduit].quantity = quantite;
        }
        localStorage.setItem('panier', JSON.stringify(tableauPanier));
    }
    
    return tableauPanier;
}

export { PanierData };