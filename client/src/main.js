import { Router } from "./lib/router.js";
import { AboutPage } from "./pages/about/page.js";
import { HomePage } from "./pages/home/page.js";
import { ProductsPage } from "./pages/products/page.js";
import { ProductDetailPage } from "./pages/productDetail/page.js";
import { ConnexionPage } from "./pages/connexion/page.js";
import { InscriptionPage } from "./pages/inscription/page.js"; // Changé InscriptionView en InscriptionPage

import { RootLayout } from "./layouts/root/layout.js";
import { The404Page } from "./pages/404/page.js";

const router = new Router('app');

router.addLayout("/", RootLayout);

router.addRoute("/", HomePage);
router.addRoute("/about", AboutPage);

router.addRoute("/products", ProductsPage);
router.addRoute("/products/:id/:slug", ProductDetailPage);

router.addRoute("/category/:id", ProductsPage);

router.addRoute("/connexion", ConnexionPage);

router.addRoute("/inscription", InscriptionPage); 

router.addRoute("*", The404Page);

router.start();