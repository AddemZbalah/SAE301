<?php
// filepath: c:\Users\addem\Desktop\SAE301\SAE301\api\src\Controller\UserController.php

require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

class UserController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId();
        
        if ($id) {
            return $this->users->find($id);
        } else {
            return $this->users->findAll();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        $data = json_decode($json);
        
        if(empty($data)) {
            http_response_code(400);
            return ['error' => 'Données JSON invalides'];
        }

        if (!isset($data->prenom) || !isset($data->nom) || !isset($data->mail) || !isset($data->password) || !isset($data->gender)) {
            http_response_code(400);
            return ["error" => "Champs manquants pour la création du compte"];
        }

        $existing = $this->users->findByMail($data->mail);
        if ($existing) {
            http_response_code(409);
            return ['error' => 'Cet email est déjà utilisé'];
        }

        $user = new User(0);
        $user->setPrenom($data->prenom);
        $user->setNom($data->nom);
        $user->setMail($data->mail);
        $user->setPassword(password_hash($data->password, PASSWORD_BCRYPT));
        $user->setGender($data->gender);

        $ok = $this->users->save($user);

        if ($ok) {
            if (session_status() === PHP_SESSION_NONE) {
                session_start();
            }
            
            $_SESSION['user_id'] = $user->getId();
            $_SESSION['user_mail'] = $user->getMail();
            $_SESSION['user_prenom'] = $user->getPrenom();
            $_SESSION['user_nom'] = $user->getNom();

            http_response_code(201);
            return [
                "logged" => true,
                "id" => $user->getId(),
                "prenom" => $user->getPrenom(),
                "nom" => $user->getNom(),
                "mail" => $user->getMail(),
                "gender" => $user->getGender()
            ];
        } else {
            http_response_code(500);
            return ["error" => "Erreur lors de la création du compte"];
        }
    }

    protected function processDeleteRequest(HttpRequest $request) {
        $id = $request->getId();
        $ok = $this->users->delete($id);
        return $ok;
    }

    protected function processPatchRequest(HttpRequest $request) {
        return false;
    }
}
?>