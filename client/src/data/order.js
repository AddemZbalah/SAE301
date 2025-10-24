import {getRequest, postRequest, } from '../lib/api-request.js';

let OrderData = {};

OrderData.fetchByUser = async function(id){
    let data = await getRequest('commande?utilisateur='+id);
    console.log(data);
    return data || [];
}

OrderData.create = async function(orderData){
    let data = await postRequest('commande', orderData);
    return data;
}

OrderData.updateStatus = async function(orderId, status){
    let data = await patchRequest('commande/'+orderId, {status: status});
    return data;
}

export { OrderData };