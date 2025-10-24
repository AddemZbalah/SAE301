<?php
// filepath: c:\Users\addem\Desktop\SAE301\SAE301\api\src\Class\Order.php

require_once "Entity.php";

class Order extends Entity implements JsonSerializable {
    private int $id;
    private int $utilisateurId;
    private float $montantTotal;
    private string $dateCreation;
    private array $articles = []; // Items de la commande

    public function __construct(int $id){
        $this->id = $id;
        $this->dateCreation = date('Y-m-d H:i:s');
    }

    // JsonSerializable
    public function jsonSerialize(): mixed {
        return [
            'id' => $this->getId(),
            'utilisateurId' => $this->getUtilisateurId(),
            'montantTotal' => $this->getMontantTotal(),
            'dateCreation' => $this->getDateCreation(),
            'articles' => $this->getArticles()
        ];
    }

    // Getters
    public function getId(): int {
        return $this->id;
    }

    public function getUtilisateurId(): int {
        return $this->utilisateurId;
    }

    public function getMontantTotal(): float {
        return $this->montantTotal;
    }

    public function getDateCreation(): string {
        return $this->dateCreation;
    }

    public function getArticles(): array {
        return $this->articles;
    }

    // Setters
    public function setId(int $id): void {
        $this->id = $id;
    }

    public function setUtilisateurId(int $utilisateurId): void {
        $this->utilisateurId = $utilisateurId;
    }

    public function setMontantTotal(float $montantTotal): void {
        $this->montantTotal = $montantTotal;
    }

    public function setDateCreation(string $dateCreation): void {
        $this->dateCreation = $dateCreation;
    }

    public function setArticles(array $articles): void {
        $this->articles = $articles;
    }

    public function ajouterArticle(array $article): void {
        $this->articles[] = $article;
    }

}