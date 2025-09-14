// Insurance tariff data
const insuranceTariffs = [
    { type: "Tourisme", power: "jusqu'à 6 CV", fuel: "Essence", price: 1840.00 },
    { type: "Tourisme", power: "jusqu'à 4 CV", fuel: "Diesel", price: 1840.00 },
    { type: "Tourisme", power: "7 CV", fuel: "Essence", price: 2238.00 },
    { type: "Tourisme", power: "8 CV", fuel: "Essence", price: 2238.00 },
    { type: "Tourisme", power: "5 CV", fuel: "Diesel", price: 2238.00 },
    { type: "Tourisme", power: "9 CV", fuel: "Essence", price: 2429.00 },
    { type: "Tourisme", power: "10 CV", fuel: "Essence", price: 2429.00 },
    { type: "Tourisme", power: "6 CV", fuel: "Diesel", price: 2429.00 },
    { type: "Tourisme", power: "7 CV", fuel: "Diesel", price: 2429.00 },
    { type: "Tourisme", power: "11 CV Plus", fuel: "Essence", price: 3490.00 },
    { type: "Tourisme", power: "8 CV Plus", fuel: "Diesel", price: 3490.00 }
];

// Settings configuration
let settings = {
    catRate: 3.5,
    taxRate: 15.45,
    parafiscalRate: 1.0,
    accessoriesAmount: 17.0,
    periodRates: {
        1: 15.0,  // 1 mois = 15%
        3: 26.0,  // 3 mois = 26%
        6: 26.0,  // 6 mois = 26%
        12: 100.0 // 12 mois = 100% (base rate)
    }
};

// DOM elements
const form = document.getElementById('insurance-form');
const resultSection = document.getElementById('result');
const errorSection = document.getElementById('error');
const tariffTbody = document.getElementById('tariff-tbody');
const settingsBtn = document.getElementById('settings-btn');
const settingsModal = document.getElementById('settings-modal');
const closeModalBtn = document.getElementById('close-modal');
const saveSettingsBtn = document.getElementById('save-settings');
const resetSettingsBtn = document.getElementById('reset-settings');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateTariffTable();
    setupFormHandler();
    setupSettingsModal();
    loadSettings();
    updateFormOptions();
});

// Populate the tariff table
function populateTariffTable() {
    tariffTbody.innerHTML = '';
    
    insuranceTariffs.forEach(tariff => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${tariff.type}</td>
            <td>${tariff.power}</td>
            <td>${tariff.fuel}</td>
            <td>${formatPrice(tariff.price)}</td>
        `;
        tariffTbody.appendChild(row);
    });
}

// Setup form submission handler
function setupFormHandler() {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        calculateInsurance();
    });
}

// Calculate insurance based on form inputs
function calculateInsurance() {
    const formData = new FormData(form);
    const vehicleType = formData.get('vehicleType');
    const enginePower = formData.get('enginePower');
    const fuelType = formData.get('fuelType');
    const period = parseInt(formData.get('period'));

    // Validate all required fields
    if (!vehicleType || !enginePower || !fuelType || !period) {
        showNotification('Veuillez remplir tous les champs requis.', 'error');
        return;
    }

    // Hide previous results
    hideResults();

    // Find matching tariff
    const matchingTariff = findMatchingTariff(vehicleType, enginePower, fuelType);

    if (matchingTariff) {
        displayResult(vehicleType, enginePower, fuelType, period, matchingTariff.price);
    } else {
        displayError();
    }
}

// Find matching tariff in the data
function findMatchingTariff(vehicleType, enginePower, fuelType) {
    return insuranceTariffs.find(tariff => 
        tariff.type === vehicleType && 
        tariff.power === enginePower && 
        tariff.fuel === fuelType
    );
}

// Calculate all premium components using current settings
function calculatePremiumBreakdown(primeRC, period) {
    // Apply period rate to base RC premium
    const periodRate = settings.periodRates[period] || 100;
    const adjustedPrimeRC = primeRC * (periodRate / 100);
    
    const calculations = {
        primeRC: adjustedPrimeRC,
        primeCat: adjustedPrimeRC * (settings.catRate / 100), // RC × CAT rate
        primeNette: 0, // Will be calculated below
        taxe: 0, // Will be calculated below
        taxeParafiscale: 0, // Will be calculated below
        accessoires: settings.accessoriesAmount, // From settings
        primeTTC: 0, // Will be calculated below
        period: period,
        periodRate: periodRate
    };
    
    // Calculate net premium (RC + CAT)
    calculations.primeNette = calculations.primeRC + calculations.primeCat;
    
    // Calculate tax (Net premium × tax rate)
    calculations.taxe = calculations.primeNette * (settings.taxRate / 100);
    
    // Calculate parafiscal tax (Net premium × parafiscal rate)
    calculations.taxeParafiscale = calculations.primeNette * (settings.parafiscalRate / 100);
    
    // Calculate total TTC (Net + Tax + Parafiscal Tax + Accessories)
    calculations.primeTTC = calculations.primeNette + calculations.taxe + calculations.taxeParafiscale + calculations.accessoires;
    
    return calculations;
}

// Display calculation result
function displayResult(vehicleType, enginePower, fuelType, period, primeRC) {
    const breakdown = calculatePremiumBreakdown(primeRC, period);
    
    // Display vehicle info
    document.getElementById('result-vehicle-type').textContent = vehicleType;
    document.getElementById('result-engine-power').textContent = enginePower;
    document.getElementById('result-fuel-type').textContent = fuelType;
    document.getElementById('result-period').textContent = `${period} mois (${breakdown.periodRate}%)`;
    
    // Display premium breakdown
    document.getElementById('result-prime-rc').textContent = formatPrice(breakdown.primeRC);
    document.getElementById('result-prime-cat').textContent = formatPrice(breakdown.primeCat);
    document.getElementById('result-prime-nette').textContent = formatPrice(breakdown.primeNette);
    document.getElementById('result-taxe').textContent = formatPrice(breakdown.taxe);
    document.getElementById('result-taxe-parafiscale').textContent = formatPrice(breakdown.taxeParafiscale);
    document.getElementById('result-accessoires').textContent = formatPrice(breakdown.accessoires);
    document.getElementById('result-prime-ttc').textContent = formatPrice(breakdown.primeTTC);
    
    resultSection.style.display = 'block';
    errorSection.style.display = 'none';
    
    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Display error message
function displayError() {
    errorSection.style.display = 'block';
    resultSection.style.display = 'none';
    
    // Smooth scroll to error
    errorSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Hide all result sections
function hideResults() {
    resultSection.style.display = 'none';
    errorSection.style.display = 'none';
}

// Format price with MAD currency
function formatPrice(price) {
    // Remove decimals if the number is a whole number
    if (price % 1 === 0) {
        return `${price.toLocaleString('fr-FR')} MAD`;
    } else {
        return `${price.toFixed(2).replace('.', ',')} MAD`;
    }
}

// Add input validation and dynamic updates
document.addEventListener('DOMContentLoaded', function() {
    const selects = form.querySelectorAll('select');
    
    selects.forEach(select => {
        select.addEventListener('change', function() {
            // Reset result when inputs change
            hideResults();
            
            // Add visual feedback for completed selections
            if (this.value) {
                this.classList.add('selected');
            } else {
                this.classList.remove('selected');
            }
        });
    });
});

// Add keyboard navigation support
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'SELECT') {
        e.preventDefault();
        const nextSelect = getNextSelect(e.target);
        if (nextSelect) {
            nextSelect.focus();
        } else {
            // If it's the last select, focus on submit button
            const submitBtn = document.querySelector('.calculate-btn');
            submitBtn.focus();
        }
    }
});

// Get next select element in the form
function getNextSelect(currentSelect) {
    const selects = Array.from(form.querySelectorAll('select'));
    const currentIndex = selects.indexOf(currentSelect);
    return selects[currentIndex + 1] || null;
}

// Settings modal functionality
function setupSettingsModal() {
    // Open settings modal
    settingsBtn.addEventListener('click', function() {
        populateSettingsModal();
        settingsModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });

    // Close modal handlers
    closeModalBtn.addEventListener('click', closeSettingsModal);
    settingsModal.addEventListener('click', function(e) {
        if (e.target === settingsModal) {
            closeSettingsModal();
        }
    });

    // Save settings
    saveSettingsBtn.addEventListener('click', saveSettings);

    // Reset settings
    resetSettingsBtn.addEventListener('click', resetSettings);

    // Add tariff button
    const addTariffBtn = document.getElementById('add-tariff-btn');
    if (addTariffBtn) {
        addTariffBtn.addEventListener('click', addNewTariff);
    }

    // ESC key to close modal
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && settingsModal.style.display === 'flex') {
            closeSettingsModal();
        }
    });
}

function populateSettingsModal() {
    // Populate rate inputs
    document.getElementById('cat-rate').value = settings.catRate;
    document.getElementById('tax-rate').value = settings.taxRate;
    document.getElementById('parafiscal-rate').value = settings.parafiscalRate;
    document.getElementById('accessories-amount').value = settings.accessoriesAmount;

    // Populate period rate inputs
    document.getElementById('period-1-rate').value = settings.periodRates[1];
    document.getElementById('period-3-rate').value = settings.periodRates[3];
    document.getElementById('period-6-rate').value = settings.periodRates[6];
    document.getElementById('period-12-rate').value = settings.periodRates[12];

    // Populate editable tariffs
    populateEditableTariffs();
}

function populateEditableTariffs() {
    const editableTariffs = document.getElementById('editable-tariffs');
    editableTariffs.innerHTML = '';

    insuranceTariffs.forEach((tariff, index) => {
        const tariffRow = document.createElement('div');
        tariffRow.className = 'tariff-row';
        tariffRow.innerHTML = `
            <span class="tariff-cell">${tariff.type}</span>
            <span class="tariff-cell">${tariff.power}</span>
            <span class="tariff-cell">${tariff.fuel}</span>
            <input type="number" class="tariff-price-input" data-index="${index}" 
                   value="${tariff.price}" step="0.01" min="0">
            <div class="tariff-actions">
                <button class="edit-btn" onclick="updateTariff(${index})">Modifier</button>
                <button class="delete-btn" onclick="deleteTariff(${index})">Supprimer</button>
            </div>
        `;
        editableTariffs.appendChild(tariffRow);
    });
}

function updateTariff(index) {
    const input = document.querySelector(`input[data-index="${index}"]`);
    const newPrice = parseFloat(input.value);
    
    if (newPrice && newPrice > 0) {
        insuranceTariffs[index].price = newPrice;
        populateTariffTable();
        showNotification('Tarif mis à jour avec succès!', 'success');
    } else {
        showNotification('Veuillez entrer un prix valide.', 'error');
    }
}

function closeSettingsModal() {
    settingsModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function saveSettings() {
    // Get values from inputs
    const newSettings = {
        catRate: parseFloat(document.getElementById('cat-rate').value),
        taxRate: parseFloat(document.getElementById('tax-rate').value),
        parafiscalRate: parseFloat(document.getElementById('parafiscal-rate').value),
        accessoriesAmount: parseFloat(document.getElementById('accessories-amount').value),
        periodRates: {
            1: parseFloat(document.getElementById('period-1-rate').value),
            3: parseFloat(document.getElementById('period-3-rate').value),
            6: parseFloat(document.getElementById('period-6-rate').value),
            12: parseFloat(document.getElementById('period-12-rate').value)
        }
    };

    // Validate settings
    const allValues = [
        newSettings.catRate,
        newSettings.taxRate,
        newSettings.parafiscalRate,
        newSettings.accessoriesAmount,
        ...Object.values(newSettings.periodRates)
    ];
    
    if (allValues.some(value => isNaN(value) || value < 0)) {
        showNotification('Veuillez entrer des valeurs valides pour tous les paramètres.', 'error');
        return;
    }

    // Update settings
    settings = newSettings;
    
    // Save to localStorage
    localStorage.setItem('insuranceSettings', JSON.stringify(settings));
    
    showNotification('Paramètres sauvegardés avec succès!', 'success');
    closeSettingsModal();
}

function resetSettings() {
    if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres aux valeurs par défaut?')) {
        settings = {
            catRate: 3.5,
            taxRate: 15.45,
            parafiscalRate: 1.0,
            accessoriesAmount: 17.0,
            periodRates: {
                1: 15.0,  // 1 mois = 15%
                3: 26.0,  // 3 mois = 26%
                6: 26.0,  // 6 mois = 26%
                12: 100.0 // 12 mois = 100% (base rate)
            }
        };
        
        localStorage.removeItem('insuranceSettings');
        populateSettingsModal();
        showNotification('Paramètres réinitialisés aux valeurs par défaut.', 'info');
    }
}

function loadSettings() {
    const savedSettings = localStorage.getItem('insuranceSettings');
    if (savedSettings) {
        try {
            settings = JSON.parse(savedSettings);
        } catch (e) {
            console.error('Error loading settings:', e);
        }
    }
}

function addNewTariff() {
    const vehicleType = document.getElementById('new-vehicle-type').value.trim();
    const enginePower = document.getElementById('new-engine-power').value.trim();
    const fuelType = document.getElementById('new-fuel-type').value;
    const price = parseFloat(document.getElementById('new-price').value);

    // Validate inputs
    if (!vehicleType || !enginePower || !fuelType || !price || price <= 0) {
        showNotification('Veuillez remplir tous les champs avec des valeurs valides.', 'error');
        return;
    }

    // Check if tariff already exists
    const existingTariff = insuranceTariffs.find(tariff => 
        tariff.type === vehicleType && 
        tariff.power === enginePower && 
        tariff.fuel === fuelType
    );

    if (existingTariff) {
        showNotification('Ce tarif existe déjà. Utilisez la fonction modifier.', 'error');
        return;
    }

    // Add new tariff
    insuranceTariffs.push({
        type: vehicleType,
        power: enginePower,
        fuel: fuelType,
        price: price
    });

    // Update displays
    populateTariffTable();
    populateEditableTariffs();
    updateFormOptions();

    // Clear form
    document.getElementById('new-vehicle-type').value = 'Tourisme';
    document.getElementById('new-engine-power').value = '';
    document.getElementById('new-fuel-type').value = 'Essence';
    document.getElementById('new-price').value = '';

    showNotification('Nouveau tarif ajouté avec succès!', 'success');
}

function deleteTariff(index) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce tarif?')) {
        insuranceTariffs.splice(index, 1);
        populateTariffTable();
        populateEditableTariffs();
        updateFormOptions();
        showNotification('Tarif supprimé avec succès!', 'success');
    }
}

function updateFormOptions() {
    // Update engine power options based on available tariffs
    const enginePowerSelect = document.getElementById('engine-power');
    const currentValue = enginePowerSelect.value;
    
    // Get unique engine powers
    const uniquePowers = [...new Set(insuranceTariffs.map(tariff => tariff.power))];
    
    // Clear and repopulate options
    enginePowerSelect.innerHTML = '<option value="">Sélectionnez la puissance</option>';
    uniquePowers.forEach(power => {
        const option = document.createElement('option');
        option.value = power;
        option.textContent = power;
        enginePowerSelect.appendChild(option);
    });
    
    // Restore previous selection if still valid
    if (uniquePowers.includes(currentValue)) {
        enginePowerSelect.value = currentValue;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}
