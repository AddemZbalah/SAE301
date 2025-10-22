<?php
// filepath: c:\Users\addem\Desktop\SAE301\SAE301\api\src\Repository\UserRepository.php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/User.php");

/**
 * Classe UserRepository
 * 
 * Gère l'accès aux données de l'entité User
 */
class UserRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    /**
     * Récupère un User par son ID
     */
    public function find($id): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE id = :value");
        $requete->bindParam(':value', $id);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $user = new User($answer->id);
        $user->setPrenom($answer->prenom);
        $user->setNom($answer->nom);
        $user->setPassword($answer->password);
        $user->setMail($answer->mail);
        $user->setGender($answer->gender);
        
        return $user;
    }

    /**
     * Récupère tous les Users
     */
    public function findAll(): array {
        $requete = $this->cnx->prepare("SELECT * FROM User");
        $requete->execute();
        $answer = $requete->fetchAll(PDO::FETCH_OBJ);

        $res = [];
        foreach($answer as $obj){
            $user = new User($obj->id);
            $user->setPrenom($obj->prenom);
            $user->setNom($obj->nom);
            $user->setPassword($obj->password);
            $user->setMail($obj->mail);
            $user->setGender($obj->gender);
            $res[] = $user;
        }
       
        return $res;
    }

    /**
     * Sauvegarde un nouveau User dans la base de données
     */
    public function save($user): bool {
        $requete = $this->cnx->prepare("INSERT INTO User (prenom, nom, password, mail, gender) VALUES (:prenom, :nom, :password, :mail, :gender)");
        $prenom = $user->getPrenom();
        $nom = $user->getNom();
        $password = $user->getPassword();
        $mail = $user->getMail();
        $gender = $user->getGender();
        
        $requete->bindParam(':prenom', $prenom);
        $requete->bindParam(':nom', $nom);
        $requete->bindParam(':password', $password);
        $requete->bindParam(':mail', $mail);
        $requete->bindParam(':gender', $gender);
        
        $answer = $requete->execute();

        if ($answer){
            $id = $this->cnx->lastInsertId();
            $user->setId($id);
            return true;
        }
          
        return false;
    }

    /**
     * Supprime un User de la base de données
     */
    public function delete($id): bool {
        $requete = $this->cnx->prepare("DELETE FROM User WHERE id = :id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    /**
     * Met à jour un User existant
     */
    public function update($user): bool {
        $requete = $this->cnx->prepare("UPDATE User SET prenom = :prenom, nom = :nom, mail = :mail, gender = :gender WHERE id = :id");
        $id = $user->getId();
        $prenom = $user->getPrenom();
        $nom = $user->getNom();
        $mail = $user->getMail();
        $gender = $user->getGender();
        
        $requete->bindParam(':id', $id);
        $requete->bindParam(':prenom', $prenom);
        $requete->bindParam(':nom', $nom);
        $requete->bindParam(':mail', $mail);
        $requete->bindParam(':gender', $gender);
        
        return $requete->execute();
    }

    /**
     * Trouve un utilisateur par son email
     */
    public function findByMail($mail): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM User WHERE mail = :mail");
        $requete->bindParam(':mail', $mail);
        $requete->execute();
        $answer = $requete->fetch(PDO::FETCH_OBJ);
        
        if ($answer == false) return null;
        
        $user = new User($answer->id);
        $user->setPrenom($answer->prenom);
        $user->setNom($answer->nom);
        $user->setPassword($answer->password);
        $user->setMail($answer->mail);
        $user->setGender($answer->gender);
        
        return $user;
    }
}
?>