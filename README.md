# Mecanica - Application SaaS pour Garages Automobiles

## Description

Mecanica est une application SaaS moderne et intuitive destinée aux garages automobiles, ateliers mécaniques et carrosseries. L'application est 100% cloud, accessible sur web et mobile avec une interface claire, simple et professionnelle.

## Fonctionnalités

### 📊 Tableau de bord
- Vue d'ensemble des ventes, achats, interventions, stock et trésorerie
- Statistiques en temps réel
- Activités récentes

### 🚗 Gestion des véhicules
- Dossier complet par véhicule avec historique des réparations
- Photos avant/en cours/après réparation
- Suivi des interventions

### 👨‍🔧 Gestion des techniciens
- Attribution des interventions
- Suivi du temps et de la productivité
- Planning hebdomadaire

### 🛒 Achats / Fournisseurs
- Suivi des commandes fournisseurs
- Gestion des règlements
- Factures reçues

### 💰 Ventes / Factures
- Création de devis et factures
- Suivi des encaissements
- Rappels de paiement

### 📦 Stock pièces détachées
- Entrées/sorties de stock
- Alertes de rupture
- Inventaire automatisé

### 🧾 Caisse / Dépenses
- Suivi des encaissements et décaissements
- Charges fixes et variables
- Rapports financiers

### 📈 Rapports et statistiques
- CA par période
- Rentabilité
- Analyses de performance

## Installation

### Prérequis

- WampServer (ou équivalent XAMPP/MAMP)
- PHP 7.4 ou supérieur
- MySQL 5.7 ou supérieur
- Navigateur web moderne

### Étapes d'installation

1. **Démarrer WampServer**
   - Lancer WampServer
   - Vérifier que Apache et MySQL sont démarrés (icône verte)

2. **Créer la base de données**
   - Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
   - Créer une nouvelle base de données nommée `mecanica`
   - Importer le fichier `database/schema.sql`

3. **Configuration**
   - Placer le dossier `mecanica` dans le répertoire `www` de WampServer
   - Vérifier la configuration dans `config/database.php`

4. **Accès à l'application**
   - Ouvrir votre navigateur
   - Aller à l'adresse : http://127.0.0.1:8080/mecanica/

### Compte de démonstration

- **Nom d'utilisateur :** admin
- **Mot de passe :** password

## Structure du projet

```
mecanica/
├── assets/
│   ├── css/
│   │   └── style.css          # Styles CSS principaux
│   └── js/
│       └── main.js            # JavaScript principal
├── config/
│   └── database.php           # Configuration base de données
├── database/
│   └── schema.sql             # Structure et données de base
├── includes/
│   ├── header.php             # En-tête commun
│   └── footer.php             # Pied de page commun
├── modules/
│   ├── vehicles.php           # Gestion des véhicules
│   ├── technicians.php        # Gestion des techniciens
│   ├── sales.php              # Ventes et factures
│   ├── stock.php              # Gestion du stock
│   └── reports.php            # Rapports et statistiques
├── index.php                  # Tableau de bord principal
├── login.php                  # Page de connexion
├── logout.php                 # Déconnexion
└── README.md                  # Ce fichier
```

## Technologies utilisées

- **Backend :** PHP 7.4+
- **Base de données :** MySQL
- **Frontend :** HTML5, CSS3, JavaScript
- **Frameworks CSS :** CSS personnalisé avec variables CSS
- **Icônes :** Font Awesome 6
- **Graphiques :** Chart.js

## Fonctionnalités techniques

### Responsive Design
- Interface adaptée desktop, tablette et mobile
- Navigation latérale sur desktop
- Navigation en bas d'écran sur mobile

### Sécurité
- Authentification par session PHP
- Protection contre les injections SQL (requêtes préparées)
- Validation des données côté serveur

### Performance
- CSS optimisé avec variables
- JavaScript modulaire
- Requêtes SQL optimisées

## Utilisation

### Première connexion
1. Connectez-vous avec le compte admin
2. Ajoutez vos techniciens dans le module "Techniciens"
3. Configurez vos fournisseurs et pièces dans "Stock"
4. Commencez à enregistrer vos clients et véhicules

### Workflow typique
1. **Réception véhicule :** Créer le dossier client/véhicule
2. **Diagnostic :** Créer une intervention et assigner un technicien
3. **Devis :** Générer un devis avec pièces et main d'œuvre
4. **Réparation :** Suivre l'avancement, prendre des photos
5. **Facturation :** Convertir le devis en facture
6. **Encaissement :** Enregistrer le paiement

## Support et développement

### Personnalisation
- Modifiez les couleurs dans `assets/css/style.css` (variables CSS)
- Ajoutez des fonctionnalités dans les modules existants
- Créez de nouveaux modules en suivant la structure existante

### Base de données
- Toutes les tables sont documentées dans `database/schema.sql`
- Utilisez les fonctions helper dans `config/database.php`

### Sécurité
- Changez le mot de passe admin par défaut
- Configurez des sauvegardes régulières de la base de données
- Utilisez HTTPS en production

## Licence

Ce projet est développé pour un usage professionnel dans le secteur automobile.

## Contact

Pour toute question ou support technique, consultez la documentation ou contactez l'équipe de développement.

---

**Mecanica** - Simplifiez la gestion de votre garage automobile 🚗
