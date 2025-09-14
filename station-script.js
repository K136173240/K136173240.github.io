// Gas Station Management System
class GasStationManager {
    constructor() {
        this.pumps = [];
        this.inventory = {
            'Gasoil': { quantity: 5000, capacity: 10000, cost: 0 },
            'Essence': { quantity: 3000, capacity: 8000, cost: 0 },
            'Super': { quantity: 2000, capacity: 6000, cost: 0 }
        };
        this.sales = [];
        this.customers = [];
        this.prices = {
            'Gasoil': 13.50,
            'Essence': 14.20,
            'Super': 15.10
        };
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.initializePumps();
        this.updateDashboard();
        this.updateCurrentDate();
        this.showSection('dashboard');
    }

    // Data persistence
    saveData() {
        const data = {
            pumps: this.pumps,
            inventory: this.inventory,
            sales: this.sales,
            customers: this.customers,
            prices: this.prices
        };
        localStorage.setItem('gasStationData', JSON.stringify(data));
    }

    loadData() {
        const savedData = localStorage.getItem('gasStationData');
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                this.pumps = data.pumps || [];
                this.inventory = data.inventory || this.inventory;
                this.sales = data.sales || [];
                this.customers = data.customers || [];
                this.prices = data.prices || this.prices;
            } catch (e) {
                console.error('Error loading data:', e);
            }
        }
    }

    // Initialize default pumps
    initializePumps() {
        if (this.pumps.length === 0) {
            this.pumps = [
                { id: 1, number: 1, fuelType: 'Gasoil', status: 'active' },
                { id: 2, number: 2, fuelType: 'Gasoil', status: 'active' },
                { id: 3, number: 3, fuelType: 'Essence', status: 'active' },
                { id: 4, number: 4, fuelType: 'Super', status: 'maintenance' }
            ];
            this.saveData();
        }
    }

    // Event listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const section = e.target.closest('.nav-btn').dataset.section;
                this.showSection(section);
            });
        });

        // Sales form
        const salesForm = document.getElementById('sales-form');
        if (salesForm) {
            salesForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processSale();
            });

            // Auto-calculate total
            const quantityInput = document.getElementById('sale-quantity');
            const priceInput = document.getElementById('sale-price');
            const fuelTypeSelect = document.getElementById('sale-fuel-type');

            [quantityInput, priceInput, fuelTypeSelect].forEach(input => {
                if (input) {
                    input.addEventListener('input', () => this.updateSaleTotal());
                }
            });

            // Auto-fill price when fuel type changes
            if (fuelTypeSelect) {
                fuelTypeSelect.addEventListener('change', (e) => {
                    const fuelType = e.target.value;
                    if (fuelType && this.prices[fuelType]) {
                        priceInput.value = this.prices[fuelType];
                        this.updateSaleTotal();
                    }
                });
            }
        }

        // Modal handlers
        this.setupModalHandlers();

        // Add pump button
        const addPumpBtn = document.getElementById('add-pump-btn');
        if (addPumpBtn) {
            addPumpBtn.addEventListener('click', () => this.showPumpModal());
        }

        // Add stock button
        const addStockBtn = document.getElementById('add-stock-btn');
        if (addStockBtn) {
            addStockBtn.addEventListener('click', () => this.showStockModal());
        }

        // Generate report button
        const generateReportBtn = document.getElementById('generate-report-btn');
        if (generateReportBtn) {
            generateReportBtn.addEventListener('click', () => this.generateReport());
        }
    }

    setupModalHandlers() {
        // Close modal buttons
        document.querySelectorAll('.close-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.hideModal(modal);
            });
        });

        // Click outside to close
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal);
                }
            });
        });

        // Pump form
        const pumpForm = document.getElementById('pump-form');
        if (pumpForm) {
            pumpForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePump();
            });
        }

        // Stock form
        const stockForm = document.getElementById('stock-form');
        if (stockForm) {
            stockForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.addStock();
            });
        }
    }

    // Navigation
    showSection(sectionName) {
        // Update nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');

        // Show section
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(sectionName).classList.add('active');

        // Update section-specific content
        switch (sectionName) {
            case 'dashboard':
                this.updateDashboard();
                break;
            case 'pumps':
                this.updatePumpsList();
                break;
            case 'inventory':
                this.updateInventory();
                break;
            case 'sales':
                this.updateSalesSection();
                break;
            case 'customers':
                this.updateCustomers();
                break;
            case 'reports':
                this.updateReports();
                break;
        }
    }

    // Dashboard updates
    updateDashboard() {
        this.updatePumpsStatus();
        this.updateFuelLevels();
        this.updateRecentSales();
        this.updateAlerts();
        this.updateHeaderStats();
    }

    updateCurrentDate() {
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            const now = new Date();
            const options = { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
            };
            dateElement.textContent = now.toLocaleDateString('fr-FR', options);
        }
    }

    updateHeaderStats() {
        const today = new Date().toDateString();
        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        );
        
        const dailyTotal = todaySales.reduce((sum, sale) => sum + sale.total, 0);
        const totalStock = Object.values(this.inventory).reduce((sum, fuel) => sum + fuel.quantity, 0);

        document.getElementById('daily-sales').textContent = `${dailyTotal.toFixed(2)} MAD`;
        document.getElementById('total-stock').textContent = `${totalStock.toLocaleString()} L`;
    }

    updatePumpsStatus() {
        const pumpsContainer = document.getElementById('pumps-status');
        if (!pumpsContainer) return;

        pumpsContainer.innerHTML = '';
        
        this.pumps.forEach(pump => {
            const pumpElement = document.createElement('div');
            pumpElement.className = `pump-status ${pump.status}`;
            pumpElement.innerHTML = `
                <div class="pump-number">P${pump.number}</div>
                <div class="pump-fuel">${pump.fuelType}</div>
            `;
            pumpsContainer.appendChild(pumpElement);
        });
    }

    updateFuelLevels() {
        const fuelContainer = document.getElementById('fuel-levels');
        if (!fuelContainer) return;

        fuelContainer.innerHTML = '';

        Object.entries(this.inventory).forEach(([fuelType, data]) => {
            const percentage = (data.quantity / data.capacity) * 100;
            let levelClass = 'high';
            if (percentage < 20) levelClass = 'low';
            else if (percentage < 50) levelClass = 'medium';

            const fuelElement = document.createElement('div');
            fuelElement.className = 'fuel-level';
            fuelElement.innerHTML = `
                <div class="fuel-info">
                    <div class="fuel-name">${fuelType}</div>
                    <div class="fuel-quantity">${data.quantity.toLocaleString()} / ${data.capacity.toLocaleString()} L</div>
                </div>
                <div class="fuel-bar">
                    <div class="fuel-bar-fill ${levelClass}" style="width: ${percentage}%"></div>
                </div>
            `;
            fuelContainer.appendChild(fuelElement);
        });
    }

    updateRecentSales() {
        const salesContainer = document.getElementById('recent-sales');
        if (!salesContainer) return;

        const recentSales = this.sales.slice(-5).reverse();
        
        if (recentSales.length === 0) {
            salesContainer.innerHTML = '<p>Aucune vente récente</p>';
            return;
        }

        salesContainer.innerHTML = '';
        recentSales.forEach(sale => {
            const saleElement = document.createElement('div');
            saleElement.className = 'sale-item';
            saleElement.innerHTML = `
                <div class="sale-info">
                    <div class="sale-time">${new Date(sale.date).toLocaleTimeString('fr-FR')}</div>
                    <div class="sale-details">P${sale.pumpNumber} - ${sale.quantity}L ${sale.fuelType}</div>
                </div>
                <div class="sale-amount">${sale.total.toFixed(2)} MAD</div>
            `;
            salesContainer.appendChild(saleElement);
        });
    }

    updateAlerts() {
        const alertsContainer = document.getElementById('alerts');
        if (!alertsContainer) return;

        const alerts = [];

        // Check low fuel levels
        Object.entries(this.inventory).forEach(([fuelType, data]) => {
            const percentage = (data.quantity / data.capacity) * 100;
            if (percentage < 10) {
                alerts.push({
                    type: 'danger',
                    message: `Stock ${fuelType} critique: ${data.quantity}L restants`
                });
            } else if (percentage < 20) {
                alerts.push({
                    type: 'warning',
                    message: `Stock ${fuelType} faible: ${data.quantity}L restants`
                });
            }
        });

        // Check pump maintenance
        const maintenancePumps = this.pumps.filter(p => p.status === 'maintenance');
        if (maintenancePumps.length > 0) {
            alerts.push({
                type: 'info',
                message: `${maintenancePumps.length} pompe(s) en maintenance`
            });
        }

        if (alerts.length === 0) {
            alertsContainer.innerHTML = '<p>Aucune alerte</p>';
            return;
        }

        alertsContainer.innerHTML = '';
        alerts.forEach(alert => {
            const alertElement = document.createElement('div');
            alertElement.className = `alert ${alert.type}`;
            alertElement.textContent = alert.message;
            alertsContainer.appendChild(alertElement);
        });
    }

    // Pumps management
    updatePumpsList() {
        const pumpsContainer = document.getElementById('pumps-list');
        if (!pumpsContainer) return;

        pumpsContainer.innerHTML = '';

        this.pumps.forEach(pump => {
            const pumpCard = document.createElement('div');
            pumpCard.className = 'pump-card';
            pumpCard.innerHTML = `
                <div class="pump-card-header">
                    <div class="pump-title">Pompe ${pump.number}</div>
                    <div class="pump-actions">
                        <button class="btn-secondary" onclick="gasStation.editPump(${pump.id})">Modifier</button>
                        <button class="btn-danger" onclick="gasStation.deletePump(${pump.id})">Supprimer</button>
                    </div>
                </div>
                <div class="pump-details">
                    <p><strong>Carburant:</strong> ${pump.fuelType}</p>
                    <p><strong>État:</strong> <span class="status-${pump.status}">${this.getStatusText(pump.status)}</span></p>
                </div>
            `;
            pumpsContainer.appendChild(pumpCard);
        });
    }

    getStatusText(status) {
        const statusMap = {
            'active': 'Active',
            'maintenance': 'Maintenance',
            'inactive': 'Inactive'
        };
        return statusMap[status] || status;
    }

    showPumpModal(pumpId = null) {
        const modal = document.getElementById('pump-modal');
        const form = document.getElementById('pump-form');
        
        if (pumpId) {
            const pump = this.pumps.find(p => p.id === pumpId);
            if (pump) {
                document.getElementById('pump-number').value = pump.number;
                document.getElementById('pump-fuel-type').value = pump.fuelType;
                document.getElementById('pump-status').value = pump.status;
                form.dataset.editId = pumpId;
            }
        } else {
            form.reset();
            delete form.dataset.editId;
        }

        this.showModal(modal);
    }

    savePump() {
        const form = document.getElementById('pump-form');
        const pumpNumber = parseInt(document.getElementById('pump-number').value);
        const fuelType = document.getElementById('pump-fuel-type').value;
        const status = document.getElementById('pump-status').value;

        const editId = form.dataset.editId;

        if (editId) {
            // Edit existing pump
            const pump = this.pumps.find(p => p.id === parseInt(editId));
            if (pump) {
                pump.number = pumpNumber;
                pump.fuelType = fuelType;
                pump.status = status;
            }
        } else {
            // Add new pump
            const newPump = {
                id: Date.now(),
                number: pumpNumber,
                fuelType: fuelType,
                status: status
            };
            this.pumps.push(newPump);
        }

        this.saveData();
        this.updatePumpsList();
        this.updateDashboard();
        this.hideModal(document.getElementById('pump-modal'));
        this.showNotification('Pompe sauvegardée avec succès!', 'success');
    }

    editPump(pumpId) {
        this.showPumpModal(pumpId);
    }

    deletePump(pumpId) {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette pompe?')) {
            this.pumps = this.pumps.filter(p => p.id !== pumpId);
            this.saveData();
            this.updatePumpsList();
            this.updateDashboard();
            this.showNotification('Pompe supprimée avec succès!', 'success');
        }
    }

    // Sales management
    updateSalesSection() {
        this.populatePumpSelects();
        this.updateDailySalesList();
    }

    populatePumpSelects() {
        const selects = ['sale-pump', 'pump-select'];
        
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '<option value="">Sélectionner</option>';
                
                this.pumps.filter(p => p.status === 'active').forEach(pump => {
                    const option = document.createElement('option');
                    option.value = pump.id;
                    option.textContent = `Pompe ${pump.number} (${pump.fuelType})`;
                    select.appendChild(option);
                });
                
                if (currentValue) select.value = currentValue;
            }
        });
    }

    updateSaleTotal() {
        const quantity = parseFloat(document.getElementById('sale-quantity').value) || 0;
        const price = parseFloat(document.getElementById('sale-price').value) || 0;
        const total = quantity * price;
        
        document.getElementById('sale-total').textContent = `${total.toFixed(2)} MAD`;
    }

    processSale() {
        const pumpId = parseInt(document.getElementById('sale-pump').value);
        const fuelType = document.getElementById('sale-fuel-type').value;
        const quantity = parseFloat(document.getElementById('sale-quantity').value);
        const price = parseFloat(document.getElementById('sale-price').value);
        const customer = document.getElementById('sale-customer').value.trim();

        // Validation
        if (!pumpId || !fuelType || !quantity || !price) {
            this.showNotification('Veuillez remplir tous les champs requis.', 'error');
            return;
        }

        // Check stock
        if (this.inventory[fuelType].quantity < quantity) {
            this.showNotification('Stock insuffisant pour cette vente.', 'error');
            return;
        }

        const pump = this.pumps.find(p => p.id === pumpId);
        if (!pump) {
            this.showNotification('Pompe non trouvée.', 'error');
            return;
        }

        // Process sale
        const sale = {
            id: Date.now(),
            date: new Date().toISOString(),
            pumpId: pumpId,
            pumpNumber: pump.number,
            fuelType: fuelType,
            quantity: quantity,
            price: price,
            total: quantity * price,
            customer: customer || null
        };

        this.sales.push(sale);
        this.inventory[fuelType].quantity -= quantity;

        this.saveData();
        this.updateDashboard();
        this.updateDailySalesList();
        
        // Reset form
        document.getElementById('sales-form').reset();
        document.getElementById('sale-total').textContent = '0.00 MAD';

        this.showNotification(`Vente enregistrée: ${quantity}L ${fuelType} - ${sale.total.toFixed(2)} MAD`, 'success');
    }

    updateDailySalesList() {
        const container = document.getElementById('daily-sales-list');
        if (!container) return;

        const today = new Date().toDateString();
        const todaySales = this.sales.filter(sale => 
            new Date(sale.date).toDateString() === today
        ).reverse();

        if (todaySales.length === 0) {
            container.innerHTML = '<p>Aucune vente aujourd\'hui</p>';
            return;
        }

        container.innerHTML = '';
        todaySales.forEach(sale => {
            const saleElement = document.createElement('div');
            saleElement.className = 'sale-item';
            saleElement.innerHTML = `
                <div class="sale-info">
                    <div class="sale-time">${new Date(sale.date).toLocaleTimeString('fr-FR')}</div>
                    <div class="sale-details">P${sale.pumpNumber} - ${sale.quantity}L ${sale.fuelType}</div>
                    ${sale.customer ? `<div class="sale-customer">Client: ${sale.customer}</div>` : ''}
                </div>
                <div class="sale-amount">${sale.total.toFixed(2)} MAD</div>
            `;
            container.appendChild(saleElement);
        });
    }

    // Inventory management
    updateInventory() {
        this.updateStockLevels();
        this.updateDeliveryHistory();
    }

    updateStockLevels() {
        const container = document.getElementById('stock-levels');
        if (!container) return;

        container.innerHTML = '';

        Object.entries(this.inventory).forEach(([fuelType, data]) => {
            const percentage = (data.quantity / data.capacity) * 100;
            let statusClass = 'good';
            let statusText = 'Bon';
            
            if (percentage < 10) {
                statusClass = 'critical';
                statusText = 'Critique';
            } else if (percentage < 20) {
                statusClass = 'low';
                statusText = 'Faible';
            }

            const stockElement = document.createElement('div');
            stockElement.className = 'stock-item';
            stockElement.innerHTML = `
                <div class="stock-info">
                    <h4>${fuelType}</h4>
                    <div class="stock-quantity">${data.quantity.toLocaleString()} L</div>
                </div>
                <div class="stock-status ${statusClass}">${statusText}</div>
            `;
            container.appendChild(stockElement);
        });
    }

    updateDeliveryHistory() {
        const container = document.getElementById('delivery-history');
        if (!container) return;

        // This would show delivery history - for now showing placeholder
        container.innerHTML = '<p>Historique des livraisons à implémenter</p>';
    }

    showStockModal() {
        const modal = document.getElementById('stock-modal');
        document.getElementById('stock-form').reset();
        this.showModal(modal);
    }

    addStock() {
        const fuelType = document.getElementById('stock-fuel-type').value;
        const quantity = parseFloat(document.getElementById('stock-quantity').value);
        const cost = parseFloat(document.getElementById('stock-cost').value);
        const supplier = document.getElementById('stock-supplier').value.trim();

        if (!fuelType || !quantity || !cost || !supplier) {
            this.showNotification('Veuillez remplir tous les champs.', 'error');
            return;
        }

        // Add to inventory
        this.inventory[fuelType].quantity += quantity;
        this.inventory[fuelType].cost += cost;

        this.saveData();
        this.updateInventory();
        this.updateDashboard();
        this.hideModal(document.getElementById('stock-modal'));
        
        this.showNotification(`Stock ajouté: ${quantity}L ${fuelType}`, 'success');
    }

    // Customers management
    updateCustomers() {
        const container = document.getElementById('customers-list');
        if (!container) return;

        container.innerHTML = '<p>Gestion des clients à implémenter</p>';
    }

    // Reports
    updateReports() {
        // Set default dates
        const today = new Date();
        const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('report-start-date').value = startDate.toISOString().split('T')[0];
        document.getElementById('report-end-date').value = today.toISOString().split('T')[0];
        
        this.generateReport();
    }

    generateReport() {
        const startDate = new Date(document.getElementById('report-start-date').value);
        const endDate = new Date(document.getElementById('report-end-date').value);
        
        const filteredSales = this.sales.filter(sale => {
            const saleDate = new Date(sale.date);
            return saleDate >= startDate && saleDate <= endDate;
        });

        this.updateSalesSummary(filteredSales);
        this.updatePumpsPerformance(filteredSales);
        this.updateFuelConsumption(filteredSales);
    }

    updateSalesSummary(sales) {
        const container = document.getElementById('sales-summary');
        if (!container) return;

        const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
        const totalQuantity = sales.reduce((sum, sale) => sum + sale.quantity, 0);
        const averageSale = sales.length > 0 ? totalSales / sales.length : 0;

        container.innerHTML = `
            <p><strong>Nombre de ventes:</strong> ${sales.length}</p>
            <p><strong>Chiffre d'affaires:</strong> ${totalSales.toFixed(2)} MAD</p>
            <p><strong>Quantité totale:</strong> ${totalQuantity.toFixed(2)} L</p>
            <p><strong>Vente moyenne:</strong> ${averageSale.toFixed(2)} MAD</p>
        `;
    }

    updatePumpsPerformance(sales) {
        const container = document.getElementById('pumps-performance');
        if (!container) return;

        const pumpStats = {};
        
        sales.forEach(sale => {
            if (!pumpStats[sale.pumpNumber]) {
                pumpStats[sale.pumpNumber] = { sales: 0, total: 0, quantity: 0 };
            }
            pumpStats[sale.pumpNumber].sales++;
            pumpStats[sale.pumpNumber].total += sale.total;
            pumpStats[sale.pumpNumber].quantity += sale.quantity;
        });

        let html = '';
        Object.entries(pumpStats).forEach(([pumpNumber, stats]) => {
            html += `
                <p><strong>Pompe ${pumpNumber}:</strong> ${stats.sales} ventes, ${stats.total.toFixed(2)} MAD</p>
            `;
        });

        container.innerHTML = html || '<p>Aucune donnée disponible</p>';
    }

    updateFuelConsumption(sales) {
        const container = document.getElementById('fuel-consumption');
        if (!container) return;

        const fuelStats = {};
        
        sales.forEach(sale => {
            if (!fuelStats[sale.fuelType]) {
                fuelStats[sale.fuelType] = { quantity: 0, total: 0 };
            }
            fuelStats[sale.fuelType].quantity += sale.quantity;
            fuelStats[sale.fuelType].total += sale.total;
        });

        let html = '';
        Object.entries(fuelStats).forEach(([fuelType, stats]) => {
            html += `
                <p><strong>${fuelType}:</strong> ${stats.quantity.toFixed(2)} L, ${stats.total.toFixed(2)} MAD</p>
            `;
        });

        container.innerHTML = html || '<p>Aucune donnée disponible</p>';
    }

    // Modal utilities
    showModal(modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    hideModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    // Notification system
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 8px;
            color: white;
            font-weight: 600;
            z-index: 1001;
            transform: translateX(400px);
            opacity: 0;
            transition: all 0.3s ease;
        `;

        // Set background color based on type
        const colors = {
            success: '#28a745',
            error: '#dc3545',
            warning: '#ffc107',
            info: '#17a2b8'
        };
        notification.style.backgroundColor = colors[type] || colors.info;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 100);

        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the gas station management system
let gasStation;
document.addEventListener('DOMContentLoaded', function() {
    gasStation = new GasStationManager();
});
