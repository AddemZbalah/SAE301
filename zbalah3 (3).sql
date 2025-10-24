-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : localhost
-- Généré le : ven. 24 oct. 2025 à 12:47
-- Version du serveur : 10.11.14-MariaDB-0+deb12u2
-- Version de PHP : 8.3.24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `zbalah3`
--

-- --------------------------------------------------------

--
-- Structure de la table `Category`
--

CREATE TABLE `Category` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Category`
--

INSERT INTO `Category` (`id`, `name`) VALUES
(1, 'Vêtements'),
(2, 'Chaussures'),
(3, 'Accessoires');

-- --------------------------------------------------------

--
-- Structure de la table `Commande`
--

CREATE TABLE `Commande` (
  `id` int(11) NOT NULL,
  `utilisateur_id` int(11) NOT NULL,
  `date_creation` datetime NOT NULL,
  `montant_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Commande_article`
--

CREATE TABLE `Commande_article` (
  `id` int(11) NOT NULL,
  `commande_id` int(11) NOT NULL,
  `produit_id` int(11) NOT NULL,
  `nom_produit` varchar(255) NOT NULL,
  `quantite` int(11) NOT NULL,
  `prix_unitaire` decimal(10,2) NOT NULL,
  `prix_total` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `Product`
--

CREATE TABLE `Product` (
  `id` int(11) NOT NULL,
  `name` varchar(256) NOT NULL,
  `category` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL DEFAULT 0.00,
  `description` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;

--
-- Déchargement des données de la table `Product`
--

INSERT INTO `Product` (`id`, `name`, `category`, `price`, `description`) VALUES
(1, 'spherica homme', 1, '291.23', 'Doudoune légère et chaude au design matelassé moderne. Tissu déperlant, capuche pratique et coupe ajustée pour un style urbain confortable.'),
(2, 'doray abx homme', 1, '199.77', 'Manteau imperméable et respirant avec technologie Amphibiox™. Coupe longue et épurée, parfaite pour affronter la pluie avec élégance.'),
(3, 'vincit homme', 1, '275.16', 'Doudoune déperlante et isolante au look contemporain. Légère, chaude et idéale pour les saisons fraîches du quotidien.'),
(4, 'aerantis homme', 1, '326.46', 'Doudoune sans manche et isolante au look contemporain. Légère, chaude et idéale pour les saisons fraîches du quotidien.'),
(8, 'spherica plus homme', 2, '356.85', 'Baskets modernes au confort exceptionnel grâce à leur semelle amortissante. Design sportif et matériaux premium pour un look urbain tendance.'),
(9, 'flextride plus homme', 2, '354.88', 'Chaussures légères et souples à l’amorti dynamique. Idéales pour le quotidien, elles allient confort prolongé et style décontracté.'),
(10, 'spherica plus femme', 2, '253.82', 'Sneakers élégantes et respirantes au design épuré. Semelle innovante pour un confort durable et une allure chic en toute occasion.'),
(15, 'belt femme', 3, '354.49', 'Ceinture en cuir lisse au design élégant. Boucle argentée raffinée, parfaite pour sublimer un look chic ou professionnel.'),
(16, 'belt homme', 3, '260.98', 'Ceinture en cuir suédé souple et résistante. Style sobre et intemporel, idéale pour un usage quotidien ou une tenue habillée.'),
(17, 'damien homme', 3, '391.45', 'Ceinture tressée en cuir haut de gamme avec boucle métallique. Allie confort, durabilité et élégance pour un style distingué.'),
(18, 'virnilisa bag femme', 3, '424.28', 'Ceinture tressée en cuir haut de gamme avec boucle métallique. Allie confort, durabilité et élégance pour un style distingué.'),
(31, 'Chaussures', 2, '100.00', 'Mocassins en cuir souple au style intemporel. Confort optimal et semelle flexible pour un usage quotidien raffiné.');

-- --------------------------------------------------------

--
-- Structure de la table `ProductGallery`
--

CREATE TABLE `ProductGallery` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `filename` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ProductGallery`
--

INSERT INTO `ProductGallery` (`id`, `product_id`, `filename`) VALUES
(29, 18, 'ceinturemarroncuire1.jpg'),
(30, 17, 'ceinturemarrondesign1.jpg'),
(31, 16, 'ceinturemarronvelour1.jpg'),
(32, 15, 'ceinturenoir1.jpg'),
(33, 3, 'doudounebeige1.jpg'),
(34, 3, 'doudounebeige2.jpg'),
(35, 3, 'doudounebeige3.jpg'),
(36, 1, 'doudouneblue1.jpg'),
(37, 1, 'doudouneblue2.jpg'),
(38, 1, 'doudouneblue3.jpg'),
(39, 4, 'doudounesansmanche1.jpg'),
(40, 4, 'doudounesansmanche2.jpg'),
(41, 4, 'doudounesansmanche3.jpg'),
(42, 2, 'kawainoir1.jpg'),
(43, 2, 'kawainoir2.jpg'),
(44, 2, 'kawainoir3.jpg'),
(45, 31, 'mocassins1.jpg'),
(46, 31, 'mocassins2.jpg'),
(47, 31, 'mocassins3.jpg'),
(48, 8, 'brownshoes1.jpg'),
(49, 8, 'brownshoes2.jpg'),
(50, 8, 'brownshoes3.jpg'),
(51, 9, 'blueshoes1.jpg'),
(52, 9, 'blueshoes2.jpg'),
(53, 9, 'blueshoes3.jpg'),
(66, 10, 'pinkshoes1.jpg'),
(67, 10, 'pinkshoes2.jpg'),
(68, 10, 'pinkshoes3.jpg');

-- --------------------------------------------------------

--
-- Structure de la table `User`
--

CREATE TABLE `User` (
  `id` int(11) NOT NULL,
  `prenom` varchar(100) NOT NULL,
  `nom` varchar(100) NOT NULL,
  `gender` enum('M','F') NOT NULL,
  `mail` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `User`
--

INSERT INTO `User` (`id`, `prenom`, `nom`, `gender`, `mail`, `password`) VALUES
(1, 'ich', 'ich', 'M', 'ich@exemeple.com', '$2y$10$HdShQtsTuID1tkMvCpF.XOrkHzEeB486nKwTBvy4Oz5aDFvHVC9pq'),
(2, 'huzeyfe', 'non', 'M', 'huzeyfe@exemple.com', '$2y$10$2kxE3oLH9/1j09QXC4tNaOSJyGJ4xT5MVWKkNdaLbIutbOyJiAPDW'),
(3, 'maya', 'abeille', 'F', 'maya@exempl.com', '$2y$10$kCtoEY3WzdGPpPvJCzYc6en1xZjFJaua6FmsPmN4QMGql42LvpY..'),
(4, 'me', 'me', 'M', 'me@exemple.com', '$2y$10$VOqBLIbvcGTt6WuJT3RdouuMEt7z8mBLtvqC0b2FnaY.sWFpVIeUu'),
(5, 'add', 'add', 'M', 'add@exemple.com', '$2y$10$ILtt6/2LzZVtwY/xDhV6dOyqCgOVAdak6srCicTqxPXiDol2t6MaS');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Category`
--
ALTER TABLE `Category`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD PRIMARY KEY (`id`),
  ADD KEY `utilisateur_id` (`utilisateur_id`);

--
-- Index pour la table `Commande_article`
--
ALTER TABLE `Commande_article`
  ADD PRIMARY KEY (`id`),
  ADD KEY `commande_id` (`commande_id`),
  ADD KEY `produit_id` (`produit_id`);

--
-- Index pour la table `Product`
--
ALTER TABLE `Product`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category` (`category`);

--
-- Index pour la table `ProductGallery`
--
ALTER TABLE `ProductGallery`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Index pour la table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mail` (`mail`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Category`
--
ALTER TABLE `Category`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `Commande`
--
ALTER TABLE `Commande`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `Commande_article`
--
ALTER TABLE `Commande_article`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT pour la table `Product`
--
ALTER TABLE `Product`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT pour la table `ProductGallery`
--
ALTER TABLE `ProductGallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT pour la table `User`
--
ALTER TABLE `User`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `Commande`
--
ALTER TABLE `Commande`
  ADD CONSTRAINT `Commande_ibfk_1` FOREIGN KEY (`utilisateur_id`) REFERENCES `User` (`id`);

--
-- Contraintes pour la table `Commande_article`
--
ALTER TABLE `Commande_article`
  ADD CONSTRAINT `Commande_article_ibfk_1` FOREIGN KEY (`commande_id`) REFERENCES `Commande` (`id`),
  ADD CONSTRAINT `Commande_article_ibfk_2` FOREIGN KEY (`produit_id`) REFERENCES `Product` (`id`);

--
-- Contraintes pour la table `Product`
--
ALTER TABLE `Product`
  ADD CONSTRAINT `category` FOREIGN KEY (`category`) REFERENCES `Category` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `ProductGallery`
--
ALTER TABLE `ProductGallery`
  ADD CONSTRAINT `ProductGallery_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `Product` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
