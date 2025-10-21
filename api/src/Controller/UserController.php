<?php
require_once "src/Controller/EntityController.php";
require_once "src/Repository/UserRepository.php";
require_once "src/Class/User.php";

class UserController extends EntityController {

    private UserRepository $users;

    public function __construct(){
        $this->users = new UserRepository();
    }

    protected function processGetRequest(HttpRequest $request) {
        $id = $request->getId("id");
        if ($id){
            $user = $this->users->find($id);
            return $user;
        }
        return $this->users->findAll();
    }

    protected function processPostRequest(HttpRequest $request) {
        // Récupérer les paramètres du formulaire
        $prenom = $request->getParam('prenom');
        $nom = $request->getParam('nom');
        $mail = $request->getParam('mail');
        $password = $request->getParam('password');
        $gender = $request->getParam('gender');
        
        // Vérifier que tout est là
        if (!$prenom || !$nom || !$mail || !$password || !$gender) {
            return false;
        }
        
        // Vérifier si l'email existe déjà
        $existing = $this->users->findByMail($mail);
        if ($existing) {
            return false;
        }
        
        // Créer l'utilisateur
        $user = new User(0);
        $user->setPrenom($prenom);
        $user->setNom($nom);
        $user->setMail($mail);
        $user->setPassword(password_hash($password, PASSWORD_BCRYPT));
        $user->setGender($gender);
        
        // Sauvegarder
        $ok = $this->users->save($user);
        
        return $ok ? $user : false;
    }
}
?>