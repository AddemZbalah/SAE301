<?php


require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";

class AuthController extends EntityController {

    private UserRepository $repository;

    public function __construct() {
        $this->repository = new UserRepository();
    }

    protected function processPostRequest(HttpRequest $request) {
        $json = $request->getJson();
        
        error_log("JSON reçu: " . $json);
        
        $data = json_decode($json);
        
        error_log("Data décodé: " . print_r($data, true));
        
        if(empty($data)) {
            http_response_code(400);
            return ['error' => 'Données JSON invalides'];
        }

        if (!isset($data->mail) || !isset($data->password)) {
            http_response_code(400);
            return ['error' => 'Email et mot de passe requis'];
        }
        
        $mail = $data->mail;
        $password = $data->password;
        
        error_log("Recherche user avec mail: " . $mail);
        
        $user = $this->repository->findByMail($mail);
        
        error_log("User trouvé: " . ($user ? "OUI" : "NON"));
        
        if (!$user) {
            http_response_code(401);
            return ['error' => 'Email ou mot de passe incorrect'];
        }
        
        error_log("Password hash en BDD: " . $user->getPassword());
        error_log("Password fourni: " . $password);
        error_log("Vérification: " . (password_verify($password, $user->getPassword()) ? "OK" : "FAIL"));
        
        if (!password_verify($password, $user->getPassword())) {
            http_response_code(401);
            return ['error' => 'Email ou mot de passe incorrect'];
        }
        
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        $_SESSION['user_id'] = $user->getId();
        $_SESSION['user_mail'] = $user->getMail();
        $_SESSION['user_prenom'] = $user->getPrenom();
        $_SESSION['user_nom'] = $user->getNom();
        
        return [
            'logged' => true,
            'message' => 'Connexion réussie',
            'id' => $user->getId(),
            'prenom' => $user->getPrenom(),
            'nom' => $user->getNom(),
            'mail' => $user->getMail(),
            'gender' => $user->getGender()
        ];
    }

    protected function processGetRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        if (!isset($_SESSION['user_id'])) {
            return [
                'logged' => false,
                'message' => 'Non connecté'
            ];
        }
        
        $user = $this->repository->find($_SESSION['user_id']);
        
        if (!$user) {
            return [
                'logged' => false,
                'message' => 'Utilisateur introuvable'
            ];
        }
        
        return [
            'logged' => true,
            'id' => $user->getId(),
            'prenom' => $user->getPrenom(),
            'nom' => $user->getNom(),
            'mail' => $user->getMail(),
            'gender' => $user->getGender()
        ];
    }

    protected function processDeleteRequest(HttpRequest $request) {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
        
        session_destroy();
        
        return [
            'success' => true,
            'message' => 'Déconnexion réussie'
        ];
    }

    protected function processPatchRequest(HttpRequest $request) {
        return false;
    }
}
?>