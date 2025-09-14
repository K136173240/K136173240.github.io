-- Installation optimisée pour phpMyAdmin 5.2.1
-- Mecanica SaaS - Gestion de garage automobile

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Créer la base de données avec collation moderne
CREATE DATABASE IF NOT EXISTS `mecanica` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `mecanica`;

-- --------------------------------------------------------

-- Structure de la table `users`
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `role` enum('admin','manager','technician','receptionist') COLLATE utf8mb4_0900_ai_ci DEFAULT 'technician',
  `first_name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `clients`
CREATE TABLE `clients` (
  `id` int NOT NULL AUTO_INCREMENT,
  `first_name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `last_name` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `address` text COLLATE utf8mb4_0900_ai_ci,
  `city` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `company` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `vehicles`
CREATE TABLE `vehicles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `client_id` int NOT NULL,
  `license_plate` varchar(20) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `brand` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `model` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `year` int DEFAULT NULL,
  `vin` varchar(17) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `engine` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `fuel_type` enum('essence','diesel','electrique','hybride') COLLATE utf8mb4_0900_ai_ci DEFAULT 'essence',
  `mileage` int DEFAULT '0',
  `color` varchar(30) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_plate` (`license_plate`),
  KEY `client_id` (`client_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `suppliers`
CREATE TABLE `suppliers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `contact_person` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `phone` varchar(20) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_0900_ai_ci,
  `city` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `postal_code` varchar(10) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `payment_terms` int DEFAULT '30',
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `parts_categories`
CREATE TABLE `parts_categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `parts`
CREATE TABLE `parts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_id` int DEFAULT NULL,
  `reference` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text COLLATE utf8mb4_0900_ai_ci,
  `supplier_id` int DEFAULT NULL,
  `purchase_price` decimal(10,2) DEFAULT '0.00',
  `sale_price` decimal(10,2) DEFAULT '0.00',
  `stock_quantity` int DEFAULT '0',
  `min_stock` int DEFAULT '0',
  `location` varchar(50) COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure de la table `interventions`
CREATE TABLE `interventions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `vehicle_id` int NOT NULL,
  `technician_id` int DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `priority` enum('low','medium','high','urgent') COLLATE utf8mb4_0900_ai_ci DEFAULT 'medium',
  `title` varchar(200) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` text COLLATE utf8mb4_0900_ai_ci,
  `diagnosis` text COLLATE utf8mb4_0900_ai_ci,
  `work_done` text COLLATE utf8mb4_0900_ai_ci,
  `estimated_hours` decimal(5,2) DEFAULT NULL,
  `actual_hours` decimal(5,2) DEFAULT NULL,
  `labor_rate` decimal(8,2) DEFAULT '45.00',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `start_date` datetime DEFAULT NULL,
  `end_date` datetime DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `vehicle_id` (`vehicle_id`),
  KEY `technician_id` (`technician_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Structure des autres tables...
CREATE TABLE `intervention_parts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `intervention_id` int NOT NULL,
  `part_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  `unit_price` decimal(10,2) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `intervention_id` (`intervention_id`),
  KEY `part_id` (`part_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `invoices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `client_id` int NOT NULL,
  `vehicle_id` int DEFAULT NULL,
  `status` enum('draft','sent','paid','overdue','cancelled') COLLATE utf8mb4_0900_ai_ci DEFAULT 'draft',
  `subtotal` decimal(10,2) DEFAULT '0.00',
  `tax_rate` decimal(5,2) DEFAULT '20.00',
  `tax_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `paid_amount` decimal(10,2) DEFAULT '0.00',
  `due_date` date DEFAULT NULL,
  `paid_date` date DEFAULT NULL,
  `payment_method` enum('cash','card','check','transfer') COLLATE utf8mb4_0900_ai_ci DEFAULT 'card',
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `client_id` (`client_id`),
  KEY `vehicle_id` (`vehicle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `purchases` (
  `id` int NOT NULL AUTO_INCREMENT,
  `purchase_number` varchar(50) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `supplier_id` int NOT NULL,
  `status` enum('pending','ordered','received','cancelled') COLLATE utf8mb4_0900_ai_ci DEFAULT 'pending',
  `order_date` date NOT NULL,
  `expected_date` date DEFAULT NULL,
  `received_date` date DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT '0.00',
  `tax_amount` decimal(10,2) DEFAULT '0.00',
  `total_amount` decimal(10,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `purchase_number` (`purchase_number`),
  KEY `supplier_id` (`supplier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `cash_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `type` enum('income','expense') COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `category` varchar(100) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `description` varchar(200) COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `payment_method` enum('cash','card','check','transfer') COLLATE utf8mb4_0900_ai_ci DEFAULT 'cash',
  `entry_date` date NOT NULL,
  `notes` text COLLATE utf8mb4_0900_ai_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Contraintes de clés étrangères
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`) ON DELETE CASCADE;

ALTER TABLE `parts`
  ADD CONSTRAINT `parts_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `parts_categories` (`id`),
  ADD CONSTRAINT `parts_ibfk_2` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

ALTER TABLE `interventions`
  ADD CONSTRAINT `interventions_ibfk_1` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `interventions_ibfk_2` FOREIGN KEY (`technician_id`) REFERENCES `users` (`id`);

ALTER TABLE `intervention_parts`
  ADD CONSTRAINT `intervention_parts_ibfk_1` FOREIGN KEY (`intervention_id`) REFERENCES `interventions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `intervention_parts_ibfk_2` FOREIGN KEY (`part_id`) REFERENCES `parts` (`id`);

ALTER TABLE `invoices`
  ADD CONSTRAINT `invoices_ibfk_1` FOREIGN KEY (`client_id`) REFERENCES `clients` (`id`),
  ADD CONSTRAINT `invoices_ibfk_2` FOREIGN KEY (`vehicle_id`) REFERENCES `vehicles` (`id`);

ALTER TABLE `purchases`
  ADD CONSTRAINT `purchases_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`);

-- Insertion des données de base
INSERT INTO `users` (`username`, `email`, `password`, `role`, `first_name`, `last_name`, `phone`) VALUES
('admin', 'admin@mecanica.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Admin', 'System', '0123456789');

INSERT INTO `parts_categories` (`name`, `description`) VALUES
('Freinage', 'Pièces de freinage: plaquettes, disques, liquide'),
('Moteur', 'Pièces moteur: filtres, bougies, courroies'),
('Suspension', 'Amortisseurs, ressorts, silent-blocs'),
('Électricité', 'Batteries, alternateurs, démarreurs'),
('Carrosserie', 'Pièces de carrosserie et accessoires'),
('Pneumatiques', 'Pneus et jantes'),
('Vidange', 'Huiles et filtres pour vidange');

INSERT INTO `suppliers` (`name`, `contact_person`, `email`, `phone`, `payment_terms`) VALUES
('AutoPièces Pro', 'Jean Dupont', 'contact@autopieces-pro.fr', '01.23.45.67.89', 30),
('Garage Supply', 'Marie Martin', 'info@garagesupply.fr', '01.98.76.54.32', 45),
('Pièces Express', 'Pierre Durand', 'commandes@pieces-express.fr', '01.11.22.33.44', 15);

INSERT INTO `parts` (`category_id`, `reference`, `name`, `description`, `supplier_id`, `purchase_price`, `sale_price`, `stock_quantity`, `min_stock`) VALUES
(1, 'PLQ-001', 'Plaquettes avant Renault', 'Plaquettes de frein avant pour Renault Clio', 1, 25.00, 45.00, 10, 2),
(1, 'DIS-001', 'Disques avant Peugeot', 'Disques de frein avant pour Peugeot 308', 1, 35.00, 65.00, 8, 2),
(2, 'FIL-001', 'Filtre à huile', 'Filtre à huile universel', 2, 8.00, 15.00, 20, 5),
(2, 'BOU-001', 'Bougies d\'allumage', 'Jeu de 4 bougies d\'allumage', 2, 12.00, 25.00, 15, 3),
(7, 'HUI-001', 'Huile moteur 5W30', 'Huile moteur synthétique 5L', 3, 22.00, 40.00, 12, 3);

INSERT INTO `clients` (`first_name`, `last_name`, `email`, `phone`, `address`, `city`, `postal_code`) VALUES
('Martin', 'Dupont', 'martin.dupont@email.fr', '06.12.34.56.78', '123 Rue de la Paix', 'Paris', '75001'),
('Sophie', 'Bernard', 'sophie.bernard@email.fr', '06.98.76.54.32', '456 Avenue des Champs', 'Lyon', '69001'),
('Pierre', 'Moreau', 'pierre.moreau@email.fr', '06.11.22.33.44', '789 Boulevard Saint-Michel', 'Marseille', '13001');

COMMIT;
