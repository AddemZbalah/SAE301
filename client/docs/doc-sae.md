# Guide d'implémentation - Système d'inscription utilisateur

## Architecture du projet

Ce projet suit une architecture MVC côté backend (PHP) et une SPA (Single Page Application) côté frontend (JavaScript vanilla).

### Structure backend (API PHP)
- **Classes** (`api/src/Class/`) : Entités métier représentant les objets du domaine
- **Repositories** (`api/src/Repository/`) : Gestion des requêtes SQL et accès aux données
- **Controllers** (`api/src/Controller/`) : Gestion des requêtes HTTP et logique métier
- **Point d'entrée** : `api/index.php` avec un routeur basique

### Structure frontend (Client JS)
- **Pages** (`client/src/pages/`) : Composants de pages complètes
- **UI** (`client/src/ui/`) : Composants réutilisables
- **Data** (`client/src/data/`) : Fonctions d'appel API
- **Lib** (`client/src/lib/`) : Utilitaires (router, api-request, etc.)

---

## Objectif : Créer un système d'inscription

L'utilisateur doit pouvoir créer un compte via un formulaire. Les données sont envoyées au backend qui les valide et les enregistre en base de données avec un mot de passe hashé.

---

## Partie 1 : Base de données

### Table utilisateur
Créer une table pour stocker les utilisateurs avec :
- Un identifiant unique auto-incrémenté
- Les informations personnelles nécessaires
- Un champ email unique
- Un champ pour le mot de passe hashé (VARCHAR 255 minimum)

**Important** : Ne JAMAIS stocker les mots de passe en clair. Utiliser `password_hash()` en PHP avec l'algorithme BCRYPT.

---

## Partie 2 : Backend PHP

### Étape 1 : Créer la classe entité

Dans `api/src/Class/`, créer une classe représentant l'utilisateur :
- Propriétés privées correspondant aux colonnes de la table
- Constructeur
- Getters et setters pour chaque propriété

**Convention** : Utiliser camelCase pour les propriétés PHP.

### Étape 2 : Créer le Repository

Dans `api/src/Repository/`, créer une classe qui étend `EntityRepository` :

**Méthode de sauvegarde** :
- Préparer une requête SQL INSERT avec tous les champs
- Utiliser `bindValue()` pour chaque paramètre
- Exécuter la requête
- Récupérer le `lastInsertId()` pour l'attribuer à l'objet
- Retourner l'objet complet

**Méthode de recherche par email (optionnelle mais recommandée)** :
- Requête SELECT WHERE email = ?
- Utile pour vérifier si l'email existe déjà

### Étape 3 : Créer le Controller

Dans `api/src/Controller/`, créer une classe qui étend `EntityController` :

**Méthode `processPostRequest($request)`** :
- Récupérer tous les paramètres envoyés via `$request->getParam('nomDuChamp')`
- **Valider** que tous les champs obligatoires sont présents et non vides
- **Valider** le format des données (email valide, longueur du mot de passe, etc.)
- **CRUCIAL** : Hasher le mot de passe avec `password_hash($motDePasse, PASSWORD_BCRYPT)`
- Créer un nouvel objet entité avec les données
- Appeler la méthode de sauvegarde du repository
- Retourner l'objet créé (SANS le hash du mot de passe)

**Gestion des réponses** :
```php
// Succès : retourner l'objet avec ses données (sauf le password_hash)
// Erreur : utiliser http_response_code(400) et retourner un message d'erreur
```

### Étape 4 : Ajouter la route

Dans `api/index.php`, ajouter la nouvelle route au tableau `$router` :
```php
$router = [
    "products" => new ProductController(),
    "users" => new VotreController(),
];
```

**Important** : Ne pas oublier les `require_once` pour inclure les nouvelles classes.

---

## Partie 3 : Frontend JavaScript

### Convention du projet : FormData

**IMPORTANT** : Ce projet utilise **FormData** pour envoyer les données (multipart/form-data), **PAS du JSON**.

Le fichier `api-request.js` est configuré pour ça, ne pas le modifier.

### Étape 1 : Créer le template HTML

Dans `client/src/ui/votreComposant/template.html` :
- Créer un `<form>` avec les champs nécessaires pour l'inscription
- **Attribut `name`** sur chaque input (crucial pour récupérer les valeurs)
- Type approprié pour chaque champ (`email`, `password`, `text`, etc.)
- Bouton de soumission

### Étape 2 : Créer le composant UI

Dans `client/src/ui/votreComposant/index.js`, créer un objet avec une méthode `dom()` :

**Pattern du projet** :
```javascript
import { htmlToFragment } from "../../lib/utils.js";
import template from "./template.html?raw";

const VotreComposant = {
  dom() {
    const frag = htmlToFragment(template);
    const form = frag.querySelector('form');
    
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      // Récupérer les valeurs via form.nomDuChamp.value
      
      // Appeler la fonction d'API
      
      // Gérer la réponse (succès/erreur)
    };
    
    return frag;
  }
};

export { VotreComposant };
```

### Étape 3 : Créer la fonction d'appel API

Dans `client/src/data/`, créer un fichier pour gérer les appels API :

```javascript
import { postRequest } from "../lib/api-request.js";

const VotreData = {
  async inscription(/* paramètres nécessaires */) {
    // Créer un FormData
    const formData = new FormData();
    
    // Ajouter chaque champ avec formData.append('nom', valeur)
    
    // Envoyer vers l'endpoint approprié
    return await postRequest('endpoint', formData);
  }
};

export { VotreData };
```

**Points clés** :
- Utiliser `FormData` et non pas `JSON.stringify()`
- Ajouter chaque champ individuellement avec `append()`
- Le nom du champ doit correspondre à ce que le backend attend

### Étape 4 : Utiliser la fonction dans le composant

Importer la fonction data et l'appeler dans `form.onsubmit` :

```javascript
const result = await VotreData.inscription(/* paramètres */);

if (result && result.id) {
  // Succès - l'utilisateur a été créé
  // Rediriger ou afficher un message
} else {
  // Erreur - afficher un message
}
```

### Étape 5 : Créer la page

Dans `client/src/pages/`, créer un contrôleur de page qui utilise le composant UI :

```javascript
import { VotreComposant } from "../../ui/votreComposant/index.js";

const VotrePage = {
  render() {
    return VotreComposant.dom();
  }
};

export { VotrePage };
```

### Étape 6 : Ajouter la route au router

Dans `client/src/main.js`, ajouter la route :

```javascript
router.addRoute({
  path: '/chemin',
  controller: VotrePage,
  useLayout: false // ou true selon besoin
});
```

---

## Points d'attention

### Sécurité backend
- ✅ **Toujours** hasher les mots de passe côté serveur avec `password_hash()`
- ✅ **Valider toutes les données** côté serveur (ne jamais faire confiance au client)
- ✅ Vérifier l'unicité de l'email avant insertion
- ✅ Utiliser des **requêtes préparées** (PDO) pour éviter les injections SQL
- ✅ Ne **jamais retourner** le hash du mot de passe au client

### Gestion d'erreurs
- Retourner des codes HTTP appropriés (200 succès, 400 erreur client, 500 erreur serveur)
- Retourner des messages d'erreur clairs et exploitables
- Logger les erreurs pour faciliter le debug

### Conventions du projet
- **FormData** obligatoire pour les POST (pas de JSON)
- Pattern **MVC** strict : Controller → Repository → Base de données
- Composants UI avec méthode `dom()` retournant un DocumentFragment
- Utiliser `htmlToFragment()` du fichier utils.js
- Utiliser `postRequest()` du fichier api-request.js (ne pas le modifier)

### Workflow de test
1. Vérifier que la table existe en base de données
2. Tester la création via le formulaire
3. Vérifier en base que l'enregistrement est créé avec un hash de mot de passe
4. Vérifier la gestion des doublons (email déjà utilisé)
5. Tester les cas d'erreur (champs manquants, format invalide, etc.)

---

## Structure finale des fichiers

```
api/
  src/
    Class/
      VotreEntite.php             # Classe représentant l'objet métier
    Repository/
      VotreRepository.php         # Gestion des requêtes SQL
    Controller/
      VotreController.php         # Gestion des requêtes HTTP
  index.php                       # Router avec les routes

client/
  src/
    data/
      votreData.js                # Fonctions d'appel API avec FormData
    pages/
      votrePage/
        page.js                   # Contrôleur de page
    ui/
      votreComposant/
        index.js                  # Composant formulaire
        template.html             # Template HTML du formulaire
    main.js                       # Router avec les routes frontend
```

---

## Workflow technique complet

1. **Utilisateur remplit le formulaire** sur la page
2. **Composant UI intercepte la soumission** avec `form.onsubmit`
3. **Récupération des valeurs** via `form.nomDuChamp.value`
4. **Appel à la fonction data** qui crée un FormData
5. **Ajout des champs** au FormData avec `append()`
6. **Envoi via `postRequest()`** vers l'endpoint API
7. **Controller reçoit la requête** et extrait les paramètres
8. **Validation des données** (présence, format, etc.)
9. **Hash du mot de passe** avec `password_hash()`
10. **Repository insère en base** avec requête préparée
11. **Récupération de l'ID** avec `lastInsertId()`
12. **Retour au client** de l'objet créé (sans le hash)
13. **Gestion de la réponse** côté client (succès/erreur)

---

## Debugging

### Côté client
- `console.log()` pour vérifier les valeurs récupérées du formulaire
- `console.log()` pour voir le résultat de l'appel API
- **Network tab** du navigateur pour inspecter la requête HTTP
- Vérifier que le Content-Type est bien `multipart/form-data`

### Côté serveur
- `error_log()` pour logger les erreurs dans le fichier de log PHP
- `var_dump()` temporaire pour voir ce qui est reçu
- Vérifier les logs d'erreur du serveur web
- Tester les requêtes SQL directement dans phpMyAdmin ou équivalent

---

## Résumé des étapes essentielles

**Backend** :
1. Table en base avec champ password_hash
2. Classe entité avec propriétés et getters/setters
3. Repository avec méthode save()
4. Controller avec validation + password_hash() + appel au repository
5. Route dans index.php

**Frontend** :
1. Template HTML avec formulaire et attributs name
2. Composant UI avec gestion de l'événement submit
3. Fonction data avec FormData et postRequest()
4. Page qui utilise le composant
5. Route dans le router

**Sécurité** :
- Hash du mot de passe avec PASSWORD_BCRYPT
- Validation côté serveur
- Requêtes préparées
- Ne pas retourner le hash au client

---

Bon courage ! 🚀
