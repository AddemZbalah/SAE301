import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { ConnexionPage } from "./pages/connexion/page.js";
import { InscriptionPage } from "./pages/inscription/page.js";
import { ProfilPage } from "./pages/profil/page.js";
import { UserData } from "./data/user.js";

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";

const router = new Router('app', {loginPath: '/connexion'});

async function updateAuthStatus() {
    const result = await UserData.getCurrentUser();
    if (result && result.logged) {
        router.setAuth(true);
    } else {
        router.setAuth(false);
    }
}

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("/category/:id", ProductsPage);

router.addRoute("/connexion", ConnexionPage, {useLayout : false});

router.addRoute("/inscription", InscriptionPage, {useLayout : false});

router.addRoute("/profil", ProfilPage, {requireAuth: true});

router.addRoute("*", The404Page);


// Fonction pour initialiser l'app
async function initApp() {
    // D'abord vérifier l'auth
    await updateAuthStatus();
    // Puis démarrer le router
    router.start();
}

// Démarrer l'app
initApp();