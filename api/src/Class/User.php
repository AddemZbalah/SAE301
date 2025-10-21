<?php

require_once ('Entity.php');

/**
 *  Class User
 * 
 *  Représente un utilisateur avec ses propriétés
 *  Implémente l'interface JsonSerializable
 */
class User extends Entity {
    private int $id;
    private ?string $prenom = null;
    private ?string $nom = null;
    private ?string $password = null;
    private ?string $mail = null;
    private ?string $gender = null;

    public function __construct(int $id){
        $this->id = $id;
    }

    /**
     * Get the value of id
     */ 
    public function getId(): int
    {
        return $this->id;
    }

    /**
     * Set the value of id
     *
     * @return  self
     */ 
    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    /**
     * Get the value of prenom
     */ 
    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    /**
     * Set the value of prenom
     *
     * @return  self
     */ 
    public function setPrenom(string $prenom): self
    {
        $this->prenom = $prenom;
        return $this;
    }

    /**
     * Get the value of nom
     */ 
    public function getNom(): ?string
    {
        return $this->nom;
    }

    /**
     * Set the value of nom
     *
     * @return  self
     */ 
    public function setNom(string $nom): self
    {
        $this->nom = $nom;
        return $this;
    }

    /**
     * Get the value of password
     */ 
    public function getPassword(): ?string
    {
        return $this->password;
    }

    /**
     * Set the value of password
     *
     * @return  self
     */ 
    public function setPassword(string $password): self
    {
        $this->password = $password;
        return $this;
    }

    /**
     * Get the value of email
     */ 
    public function getMail(): ?string
    {
        return $this->mail;
    }

    /**
     * Set the value of email
     *
     * @return  self
     */ 
    public function setMail(string $mail): self
    {
        $this->mail = $mail;
        return $this;
    }

    /**
     * Get the value of email
     */ 
    public function getGender(): ?string
    {
        return $this->gender;
    }

    /**
     * Set the value of gender
     *
     * @return  self
     */ 
    public function setGender(string $gender): self
    {
        $this->gender = $gender;
        return $this;
    }

    /**
     * Define how to convert/serialize a User to JSON format
     */
    public function jsonSerialize(): mixed
    {
        return [
            "id" => $this->id,
            "prenom" => $this->prenom,
            "nom" => $this->nom,
            "mail" => $this->mail,
            "gender" => $this->gender,
            // Note: password n'est pas inclus dans le JSON pour des raisons de sécurité
        ];
    }
}