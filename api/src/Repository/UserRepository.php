<?php

require_once("src/Repository/EntityRepository.php");
require_once("src/Class/User.php");

class UserRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    public function find($id): ?User {
        $requete = $this->cnx->prepare("SELECT * FROM user WHERE id = :value");
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
            array_push($res, $user);
        }
       
        return $res;
    }

    public function save($user){
        $requete = $this->cnx->prepare("INSERT INTO User (prenom, nom, password, mail, gender) VALUES (:prenom, :nom, :password, :mail, :gender)");
        $prenom = $user->getPrenom();
        $nom = $user->getNom();
        $password = $user->getPassword(); // Déjà hashé dans le controller
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

    public function delete($id){
        $requete = $this->cnx->prepare("DELETE FROM User WHERE id = :id");
        $requete->bindParam(':id', $id);
        return $requete->execute();
    }

    public function update($user){
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