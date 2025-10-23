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

    public function patch(HttpRequest $request) {
        return $this->processPatchRequest($request);
    }

    protected function processPatchRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['user_id'])) {
            http_response_code(401);
            return ['error' => 'Non authentifié'];
        }
        
        $json = $request->getJson();
        $data = json_decode($json);
        
        if (!$data) {
            http_response_code(400);
            return ['error' => 'Données JSON invalides'];
        }
        
        $userId = $_SESSION['user_id'];
        $user = $this->users->find($userId);  // Changé de $this->repository à $this->users
        
        if (!$user) {
            http_response_code(404);
            return ['error' => 'Utilisateur non trouvé'];
        }
        
        if (isset($data->prenom)) {
            $user->setPrenom($data->prenom);
        }
        
        if (isset($data->nom)) {
            $user->setNom($data->nom);
        }
        
        if (isset($data->mail)) {
            $existingUser = $this->users->findByMail($data->mail);  // Changé aussi ici
            if ($existingUser && $existingUser->getId() !== $userId) {
                http_response_code(409);
                return ['error' => 'Cet email est déjà utilisé'];
            }
            $user->setMail($data->mail);
        }
        
        if (isset($data->gender)) {
            $user->setGender($data->gender);
        }
        
        if (isset($data->newPassword) && !empty($data->newPassword)) {
            if (!isset($data->currentPassword) || empty($data->currentPassword)) {
                http_response_code(400);
                return ['error' => 'Mot de passe actuel requis'];
            }
            
            if (!password_verify($data->currentPassword, $user->getPassword())) {
                http_response_code(401);
                return ['error' => 'Mot de passe actuel incorrect'];
            }
            
            $user->setPassword(password_hash($data->newPassword, PASSWORD_DEFAULT));
        }
        
        $success = $this->users->update($user);  // Changé aussi ici
        
        if ($success) {
            return [
                'success' => true,
                'message' => 'Profil mis à jour',
                'user' => [
                    'id' => $user->getId(),
                    'prenom' => $user->getPrenom(),
                    'nom' => $user->getNom(),
                    'mail' => $user->getMail(),
                    'gender' => $user->getGender()
                ]
            ];
        }
        
        http_response_code(500);
        return ['error' => 'Erreur lors de la mise à jour'];
    }
}
?>