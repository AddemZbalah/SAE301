<?php

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once "src/Controller/ProductController.php";
require_once "src/Controller/UserController.php";
require_once "src/Controller/EntityController.php";
require_once "src/Class/HttpRequest.php";
require_once "src/Class/Entity.php";
require_once "src/Class/Product.php";
require_once "src/Class/User.php";
require_once "src/Repository/EntityRepository.php";
require_once "src/Repository/ProductRepository.php";
require_once "src/Repository/UserRepository.php";



$router = [
    "products" => new ProductController(),
    "users" => new UserController(),
];






$request = new HttpRequest();


if ($request->getMethod() == "OPTIONS"){
    http_response_code(200);
    exit();
}


$route = $request->getRessources();

if ( isset($router[$route]) ){ 
    $ctrl = $router[$route];  
    $json = $ctrl->jsonResponse($request); 
    if ($json){ 
        header("Content-type: application/json;charset=utf-8");
        echo $json;
    }
    else{
        http_response_code(404); 
    }
    die();
}
http_response_code(404);
die();

?>