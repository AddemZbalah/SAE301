import { ProductData } from "../../data/product.js";
import { ProductView } from "../../ui/product/index.js";
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";


let M = {
    products: []
};




let C = {};

C.handler_clickOnProduct = function(ev){
    if (ev.target.dataset.buy!==undefined){
        let id = ev.target.dataset.buy;
        alert(`Le produit d'identifiant ${id} ? Excellent choix !`);
    }
}

C.init = async function(params){
    if (params.id){
            M.products = (await ProductData.fetchAllByCategory(params.id));
    }
    else{
          M.products = await ProductData.fetchAll();
    }
    return V.init( M.products );
}




let V = {};

V.init = function(data){
    let fragment = V.createPageFragment(data);
    V.attachEvents(fragment);
    return fragment;
}

V.createPageFragment = function( data ){

   let pageFragment = htmlToFragment(template);
   

   let productsDOM = ProductView.dom(data);
   

   pageFragment.querySelector('slot[name="products"]').replaceWith(productsDOM);

   pageFragment.getElementById("nbrarticle").textContent = `${data.length} articles`;
   
   return pageFragment;
}

V.attachEvents = function(pageFragment) {
    let root = pageFragment.firstElementChild;
    root.addEventListener("click", C.handler_clickOnProduct);
    return pageFragment;
}

export function ProductsPage(params) {
    console.log("ProductsPage", params);
    return C.init(params);
}


