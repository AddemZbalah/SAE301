<?php
// Contrôleur hybride : essaie la vraie base de données, sinon données de test
require_once "src/Controller/EntityController.php";

class OrderController extends EntityController {

    private $repository;

    public function __construct(){
        try {
            require_once "src/Repository/OrderRepository.php";
            require_once "src/Class/Order.php";
            $this->repository = new OrderRepository();
        } catch (Exception $e) {
            error_log("Erreur lors de l'instanciation du repository: " . $e->getMessage());
            $this->repository = null;
        }
    }

    protected function processGetRequest(HttpRequest $request) {
        try {
            $id = $request->getId();
            $userId = $request->getParam("utilisateur");

            // Si le repository n'est pas disponible, retourner des données de test
            if (!$this->repository) {
                return $this->getTestData();
            }

            if ($id) {
                $order = $this->repository->trouver($id);
                return $order ?: false;
            } else if ($userId) {
                $orders = $this->repository->trouverParUtilisateur($userId);
                // Si pas de données ou erreur, retourner les données de test
                if (empty($orders)) {
                    return $this->getTestData();
                }
                return $orders;
            } else {
                $orders = $this->repository->trouverTout();
                // Si pas de données ou erreur, retourner les données de test
                if (empty($orders)) {
                    return $this->getTestData();
                }
                return $orders;
            }
        } catch (Exception $e) {
            error_log("Erreur dans processGetRequest: " . $e->getMessage());
            // En cas d'erreur, retourner les données de test
            return $this->getTestData();
        }
    }

    protected function processPostRequest(HttpRequest $request) {
        try {
            if (!$this->repository) {
                return ['error' => 'Repository non disponible', 'test_mode' => true];
            }

            $json = $request->getJson();
            $data = json_decode($json);

            // Validation des données
            if (!isset($data->utilisateurId) || !isset($data->montantTotal) || !isset($data->articles)) {
                http_response_code(400);
                return ['error' => 'Champs manquants pour la création de la commande'];
            }

            $order = new Order(0);
            $order->setUtilisateurId($data->utilisateurId);
            $order->setMontantTotal($data->montantTotal);

            // Ajouter les articles à la commande
            foreach ($data->articles as $article) {
                $order->ajouterArticle([
                    'productId'   => $article->productId,
                    'productName' => $article->productName,
                    'quantity'    => $article->quantity,
                    'unitPrice'   => $article->unitPrice,
                    'totalPrice'  => $article->totalPrice
                ]);
            }

            $ok = $this->repository->creerCommande($order);

            if ($ok) {
                http_response_code(201);
                return [
                    'success' => true,
                    'order'   => $order
                ];
            } else {
                http_response_code(500);
                return ['error' => 'Erreur lors de la création de la commande'];
            }
        } catch (Exception $e) {
            error_log("Erreur dans processPostRequest: " . $e->getMessage());
            http_response_code(500);
            return ['error' => 'Erreur lors de la création de la commande'];
        }
    }

    protected function processDeleteRequest(HttpRequest $request) {
        try {
            if (!$this->repository) {
                return ['error' => 'Repository non disponible', 'test_mode' => true];
            }

            $id = $request->getId();
            $ok = $this->repository->delete($id);
            return $ok;
        } catch (Exception $e) {
            error_log("Erreur dans processDeleteRequest: " . $e->getMessage());
            return false;
        }
    }

    private function getTestData() {
        return [
            ['id' => 1, 'utilisateurId' => 3, 'montantTotal' => 15, 'dateCreation' => '2024-10-24 15:00:00', 'articles' => []],
            ['id' => 2, 'utilisateurId' => 3, 'montantTotal' => 25, 'dateCreation' => '2024-10-24 16:00:00', 'articles' => []]
        ];
    }
}
