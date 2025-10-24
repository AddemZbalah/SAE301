let PanierData = {};

PanierData.ajouterAuPanier = async function(product){
    console.log('Produit reçu dans ajouterAuPanier:', product);
    console.log('Images du produit:', product.images);
    
    let cart = localStorage.getItem('panier');
    let cartArray = cart ? JSON.parse(cart) : [];
    
    const existingProductIndex = cartArray.findIndex(item => item.id === product.id);
    
    if (existingProductIndex !== -1) {
        cartArray[existingProductIndex].quantity += 1;
    } else {
        
        let imageUrl = '/assets/image/products/default.jpg';
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
            imageUrl = `/assets/image/products/${product.images[0]}`;
        }
        
        const nouveauProduit = {
            id: product.id,
            name: product.name,
            price: product.price,
            image: imageUrl,
            quantity: 1
        };
        
        console.log('✅ Nouveau produit créé:', nouveauProduit);
        cartArray.push(nouveauProduit);
    }
    
    localStorage.setItem('panier', JSON.stringify(cartArray));
    console.log('💾 Panier sauvegardé:', cartArray);

    PanierData.updateCartBadge();
    return cartArray;
}

PanierData.updateCartBadge = function() {
    const cartCountBadge = document.querySelector('#cart-count-badge');
    
    if (cartCountBadge) {
        const cartItems = PanierData.obtenirPanier();
        const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        
        cartCountBadge.textContent = count;
        
        if (count > 0) {
            cartCountBadge.classList.remove('hidden');
            cartCountBadge.classList.add('flex');
        } else {
            cartCountBadge.classList.add('hidden');
            cartCountBadge.classList.remove('flex');
        }
    }
}

PanierData.obtenirPanier = function() {
    let cart = localStorage.getItem('panier');
    return cart ? JSON.parse(cart) : [];
}

PanierData.viderPanier = function() {
    localStorage.removeItem('panier');
    PanierData.updateCartBadge(); 
    return [];
}

PanierData.retirerDuPanier = function(productId) {
    let cartArray = PanierData.obtenirPanier();
    cartArray = cartArray.filter(item => item.id !== Number(productId));
    localStorage.setItem('panier', JSON.stringify(cartArray));
    PanierData.updateCartBadge(); 
    return cartArray;
}

PanierData.modifierQuantite = function(productId, quantity) {
    let cartArray = PanierData.obtenirPanier();
    const productIndex = cartArray.findIndex(item => item.id === productId);
    
    if (productIndex !== -1) {
        if (quantity <= 0) {
            cartArray.splice(productIndex, 1);
        } else {
            cartArray[productIndex].quantity = quantity;
        }
        localStorage.setItem('panier', JSON.stringify(cartArray));
    }
    PanierData.updateCartBadge();
    return cartArray;
}

export { PanierData };