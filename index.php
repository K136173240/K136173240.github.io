<?php
session_start();

// Vérifier si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    header('Location: login.php');
    exit();
}

include 'config/database.php';
include 'includes/header.php';
?>

<div class="dashboard-container">
    <div class="dashboard-header">
        <h1>Tableau de bord - Mecanica</h1>
        <div class="date-info">
            <?php echo date('d/m/Y'); ?>
        </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
                <h3>CA du mois</h3>
                <p class="stat-value">€ 15,420</p>
                <span class="stat-change positive">+12%</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">🚗</div>
            <div class="stat-content">
                <h3>Véhicules en cours</h3>
                <p class="stat-value">8</p>
                <span class="stat-change">En atelier</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">📦</div>
            <div class="stat-content">
                <h3>Stock critique</h3>
                <p class="stat-value">5</p>
                <span class="stat-change warning">Articles</span>
            </div>
        </div>
        
        <div class="stat-card">
            <div class="stat-icon">👨‍🔧</div>
            <div class="stat-content">
                <h3>Techniciens actifs</h3>
                <p class="stat-value">4</p>
                <span class="stat-change">Disponibles</span>
            </div>
        </div>
    </div>

    <!-- Modules principaux -->
    <div class="modules-grid">
        <a href="modules/vehicles.php" class="module-card">
            <div class="module-icon">🚗</div>
            <h3>Véhicules</h3>
            <p>Gestion des véhicules clients et historique des réparations</p>
        </a>
        
        <a href="modules/technicians.php" class="module-card">
            <div class="module-icon">👨‍🔧</div>
            <h3>Techniciens</h3>
            <p>Attribution des interventions et suivi du temps</p>
        </a>
        
        <a href="modules/purchases.php" class="module-card">
            <div class="module-icon">🛒</div>
            <h3>Achats / Fournisseurs</h3>
            <p>Suivi des commandes et règlements fournisseurs</p>
        </a>
        
        <a href="modules/sales.php" class="module-card">
            <div class="module-icon">💰</div>
            <h3>Ventes / Factures</h3>
            <p>Devis, factures et encaissements</p>
        </a>
        
        <a href="modules/stock.php" class="module-card">
            <div class="module-icon">📦</div>
            <h3>Stock pièces</h3>
            <p>Gestion des pièces détachées et inventaire</p>
        </a>
        
        <a href="modules/cash.php" class="module-card">
            <div class="module-icon">🧾</div>
            <h3>Caisse / Dépenses</h3>
            <p>Suivi des encaissements et décaissements</p>
        </a>
        
        <a href="modules/reports.php" class="module-card">
            <div class="module-icon">📈</div>
            <h3>Rapports</h3>
            <p>Statistiques et analyses de performance</p>
        </a>
    </div>

    <!-- Activités récentes -->
    <div class="recent-activities">
        <h2>Activités récentes</h2>
        <div class="activity-list">
            <div class="activity-item">
                <div class="activity-icon">🚗</div>
                <div class="activity-content">
                    <p><strong>Véhicule ajouté:</strong> Renault Clio - AB-123-CD</p>
                    <span class="activity-time">Il y a 2 heures</span>
                </div>
            </div>
            
            <div class="activity-item">
                <div class="activity-icon">💰</div>
                <div class="activity-content">
                    <p><strong>Facture créée:</strong> #FAC-2024-001 - 450€</p>
                    <span class="activity-time">Il y a 3 heures</span>
                </div>
            </div>
            
            <div class="activity-item">
                <div class="activity-icon">📦</div>
                <div class="activity-content">
                    <p><strong>Stock mis à jour:</strong> Plaquettes de frein</p>
                    <span class="activity-time">Il y a 5 heures</span>
                </div>
            </div>
        </div>
    </div>
</div>

<?php include 'includes/footer.php'; ?>
