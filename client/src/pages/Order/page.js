import template from "./template.html?raw";
import { htmlToFragment } from "../../lib/utils.js";
import { OrderData } from "../../data/order.js";
import { UserData } from "../../data/user.js";

export async function OrderPage() {
    // Récupère l'utilisateur connecté
    const user = await UserData.getCurrentUser();
    let tpl = template;

    if (!user || !user.id) {
        tpl = tpl.replace("{{productCount}}", "0").replace("{{orderTotal}}", "0.00");
        const fragment = htmlToFragment(tpl);
        fragment.querySelector("#orders-list").innerHTML = `
            <div class="p-8 text-center text-red">Veuillez vous connecter pour voir vos commandes.</div>
        `;
        return fragment;
    }

    // Récupère les commandes de l'utilisateur
    const orders = await OrderData.fetchByUser(user.id);

    // Calcul du total produits et montant
    let totalProducts = 0;
    let totalAmount = 0;
    orders.forEach(order => {
        const items = order.articles || order.items || [];
        totalProducts += items.reduce((sum, item) => sum + item.quantity, 0);
        totalAmount += Number(order.montantTotal || order.totalAmount || 0);
    });

    tpl = tpl.replace("{{productCount}}", totalProducts)
             .replace("{{orderTotal}}", totalAmount.toFixed(2));

    const fragment = htmlToFragment(tpl);

    // Injecte le détail des commandes si besoin
    fragment.querySelector("#orders-list").innerHTML = orders.map(order => `
        <article class="border rounded-lg p-6 shadow-sm bg-white">
            <div class="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                <div>
                    <span class="font-semibold">Commande n°${order.id}</span>
                    <span class="ml-4 text-gray-500">Le ${order.dateCreation || order.createdAt}</span>
                </div>
                <div class="font-bold text-lg text-ajoutpanier">${order.montantTotal || order.totalAmount} €</div>
            </div>
            <div>
                <h3 class="font-semibold mb-2">Articles :</h3>
                <ul class="list-disc pl-6">
                    ${(order.articles || order.items || []).map(item => `
                        <li>
                            ${item.productName} × ${item.quantity} — 
                            <span class="text-gray-600">${item.totalPrice} €</span>
                        </li>
                    `).join('')}
                </ul>
            </div>
        </article>
    `).join("");

    return fragment;
}