<?php

require_once "src/Class/Order.php";
require_once "src/Repository/EntityRepository.php";

class OrderRepository extends EntityRepository {

    public function __construct(){
        parent::__construct();
    }

    /**
     * Créer une nouvelle commande avec ses articles
     */
    public function creerCommande(Order $commande): bool {
        try {
            $this->cnx->beginTransaction();

            // 1. Insérer la commande dans la table Commande
            $stmt = $this->cnx->prepare(
                "INSERT INTO Commande (utilisateur_id, date_creation, montant_total) VALUES (:utilisateur_id, :date_creation, :montant_total)"
            );
            $stmt->bindValue(':utilisateur_id', $commande->getUtilisateurId(), PDO::PARAM_INT);
            $stmt->bindValue(':date_creation', $commande->getDateCreation(), PDO::PARAM_STR);
            $stmt->bindValue(':montant_total', $commande->getMontantTotal(), PDO::PARAM_STR);

            $stmt->execute();

            // Récupérer l'ID de la commande créée
            $commandeId = $this->cnx->lastInsertId();
            $commande->setId($commandeId);

            // 2. Insérer les articles de la commande dans Commande_article
            $stmtArticle = $this->cnx->prepare(
                "INSERT INTO Commande_article (commande_id, produit_id, nom_produit, quantite, prix_unitaire, prix_total) 
                 VALUES (:commande_id, :produit_id, :nom_produit, :quantite, :prix_unitaire, :prix_total)"
            );

            foreach ($commande->getArticles() as $article) {
                $stmtArticle->bindValue(':commande_id', $commandeId, PDO::PARAM_INT);
                $stmtArticle->bindValue(':produit_id', $article['productId'], PDO::PARAM_INT);
                $stmtArticle->bindValue(':nom_produit', $article['productName'], PDO::PARAM_STR);
                $stmtArticle->bindValue(':quantite', $article['quantity'], PDO::PARAM_INT);
                $stmtArticle->bindValue(':prix_unitaire', $article['unitPrice'], PDO::PARAM_STR);
                $stmtArticle->bindValue(':prix_total', $article['totalPrice'], PDO::PARAM_STR);
                $stmtArticle->execute();
            }

            $this->cnx->commit();
            return true;

        } catch (PDOException $e) {
            $this->cnx->rollBack();
            error_log("Erreur lors de la création de la commande : " . $e->getMessage());
            return false;
        }
    }

    /**
     * Récupérer une commande par son ID avec ses articles
     */
    public function trouver($id): ?Order {
        try {
            $stmt = $this->cnx->prepare(
                "SELECT * FROM Commande WHERE id = :id"
            );
            $stmt->bindValue(':id', $id, PDO::PARAM_INT);
            $stmt->execute();
            $data = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$data) {
                return null;
            }

            $commande = new Order($data['id']);
            $commande->setUtilisateurId($data['utilisateur_id']);
            $commande->setDateCreation($data['date_creation']);
            $commande->setMontantTotal($data['montant_total']);

            // Récupérer les articles de la commande
            $stmtArticles = $this->cnx->prepare(
                "SELECT * FROM Commande_article WHERE commande_id = :commande_id"
            );
            $stmtArticles->bindValue(':commande_id', $id, PDO::PARAM_INT);
            $stmtArticles->execute();
            $articles = $stmtArticles->fetchAll(PDO::FETCH_ASSOC);

            foreach ($articles as $article) {
                $commande->ajouterArticle([
                    'productId'   => $article['produit_id'],
                    'productName' => $article['nom_produit'],
                    'quantity'    => $article['quantite'],
                    'unitPrice'   => floatval($article['prix_unitaire']),
                    'totalPrice'  => floatval($article['prix_total'])
                ]);
            }

            return $commande;

        } catch (PDOException $e) {
            error_log("Erreur lors de la récupération de la commande : " . $e->getMessage());
            return null;
        }
    }

    /**
     * Récupérer toutes les commandes
     */
    public function trouverTout(): array {
        try {
            $stmt = $this->cnx->prepare("SELECT * FROM Commande ORDER BY date_creation DESC");
            $stmt->execute();
            $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

            $commandes = [];
            foreach ($data as $row) {
                $commande = $this->trouver($row['id']);
                if ($commande) {
                    $commandes[] = $commande;
                }
            }

            return $commandes;

        } catch (PDOException $e) {
            error_log("Erreur lors de la récupération de toutes les commandes : " . $e->getMessage());
            return [];
        }
    }

    /**
     * Récupérer toutes les commandes d'un utilisateur
     */
    public function trouverParUtilisateur(int $utilisateurId): array {
            try {
        // Mets ce code ici :
        $stmt = $this->cnx->prepare(
            "SELECT * FROM Commande WHERE utilisateur_id = :utilisateur_id ORDER BY date_creation DESC"
        );
        $stmt->bindValue(':utilisateur_id', $utilisateurId, PDO::PARAM_INT);
        $stmt->execute();
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $commandes = [];
        foreach ($data as $row) {
            $commande = $this->trouver($row['id']);
            if ($commande) {
                $commandes[] = $commande;
            }
        }

        return $commandes;

    } catch (PDOException $e) {
        error_log("Erreur lors de la récupération des commandes utilisateur : " . $e->getMessage());
        return [];
    }
}
    public function find($id) {
        return $this->trouver($id);
}

    public function findAll() {
        return $this->trouverTout();
}

    public function save($commande){
        // Non implémenté
        return false;
    }

    public function delete($id){
        // Non implémenté
        return false;
    }

    public function update($entity){
        // Non implémenté
        return false;
    }
}