// ========================================
// HEMODIALYSIS DASHBOARD - PHASE 2
// Calculations and Dynamic Updates
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard Phase 2 initialized');
    
    // Initialize Modal Controls
    initializeModals();
    
    // Initialize Charts
    initializeCharts();
    
    // Initialize Form Handlers
    initializeFormHandlers();
    
    // Initialize Tooltips
    initializeTooltips();
    
    // Initialize Session Table Auto-calculation
    initializeSessionTableCalc();
    
    // Initialize Inventory Table Auto-calculation
    initializeInventoryTableCalc();
});

// ========================================
// INVENTORY TABLE AUTO-CALCULATION
// ========================================

function initializeInventoryTableCalc() {
    const items = [
        'filtro', 'heparina', 'acido-potasio', 'bicarbonato', 'lineas',
        'kit-cateter', 'solucion-fisio', 'acido-citrico', 'clorhexedina',
        'normogotero', 'jeringa-10', 'aguja-arterial', 'aguja-venosa',
        'aguja-hipo', 'kit-fistula', 'jabon-clorhex'
    ];
    
    items.forEach(item => {
        const qtyInput = document.querySelector(`input[data-item="${item}"].inv-qty`);
        const priceInput = document.querySelector(`input[data-item="${item}"].inv-price`);
        
        const updateTotal = () => {
            const qty = parseFloat(qtyInput.value) || 0;
            const price = parseFloat(priceInput.value) || 0;
            const total = qty * price;
            document.getElementById(`total-${item}`).textContent = 
                '$' + total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
            updateGrandTotal();
        };
        
        qtyInput.addEventListener('input', updateTotal);
        priceInput.addEventListener('input', updateTotal);
    });
}

function updateGrandTotal() {
    const items = [
        'filtro', 'heparina', 'acido-potasio', 'bicarbonato', 'lineas',
        'kit-cateter', 'solucion-fisio', 'acido-citrico', 'clorhexedina',
        'normogotero', 'jeringa-10', 'aguja-arterial', 'aguja-venosa',
        'aguja-hipo', 'kit-fistula', 'jabon-clorhex'
    ];
    
    let grandTotal = 0;
    items.forEach(item => {
        const qtyInput = document.querySelector(`input[data-item="${item}"].inv-qty`);
        const priceInput = document.querySelector(`input[data-item="${item}"].inv-price`);
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        grandTotal += (qty * price);
    });
    
    document.getElementById('inventory-grand-total').textContent = 
        '$' + grandTotal.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ========================================
// TOOLTIP SYSTEM
// ========================================

function initializeTooltips() {
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');
    const tooltipContainer = document.getElementById('tooltipContainer');
    
    tooltipIcons.forEach(icon => {
        icon.addEventListener('mouseenter', (e) => {
            const formula = icon.getAttribute('data-tooltip');
            tooltipContainer.textContent = formula;
            tooltipContainer.classList.add('active');
            
            // Position tooltip
            const rect = icon.getBoundingClientRect();
            tooltipContainer.style.left = rect.left + 'px';
            tooltipContainer.style.top = (rect.bottom + 10) + 'px';
        });
        
        icon.addEventListener('mouseleave', () => {
            tooltipContainer.classList.remove('active');
        });
    });
}

// ========================================
// SESSION TABLE AUTO-CALCULATION
// ========================================

function initializeSessionTableCalc() {
    const sessionInputs = [
        'sessions-mon',
        'sessions-tue',
        'sessions-wed',
        'sessions-thu',
        'sessions-fri',
        'sessions-sat'
    ];
    
    const totalDisplay = document.getElementById('sessions-week-total');
    const week6Input = document.getElementById('week-6');
    
    sessionInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', () => {
            let total = 0;
            sessionInputs.forEach(id => {
                const val = parseInt(document.getElementById(id).value) || 0;
                total += val;
            });
            totalDisplay.textContent = total;
            // Update week-6 (current week) automatically
            if (week6Input) {
                week6Input.value = total;
            }
        });
    });
}

// ========================================
// MODAL CONTROLS (4 INDEPENDENT MODALS)
// ========================================

function initializeModals() {
    const sections = ['clinical', 'operational', 'patient', 'financial'];
    
    sections.forEach(section => {
        const modal = document.getElementById(`modal${capitalize(section)}`);
        const openBtn = document.querySelector(`[data-section="${section}"]`);
        const closeBtn = document.querySelector(`[data-close="${section}"]`);
        const cancelBtn = document.querySelector(`[data-cancel="${section}"]`);
        
        // Open modal
        openBtn.addEventListener('click', () => {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        // Close modal functions
        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };
        
        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    });
    
    // Close any modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            sections.forEach(section => {
                const modal = document.getElementById(`modal${capitalize(section)}`);
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            });
        }
    });
}

// ========================================
// FORM HANDLERS WITH CALCULATIONS
// ========================================

function initializeFormHandlers() {
    // Clinical Quality Form
    const clinicalForm = document.getElementById('formClinical');
    clinicalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateClinicalQuality(new FormData(clinicalForm));
    });
    
    // Patient Experience Form
    const patientForm = document.getElementById('formPatient');
    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updatePatientExperience(new FormData(patientForm));
    });
    
    // Financial Overview Form
    const financialForm = document.getElementById('formFinancial');
    financialForm.addEventListener('submit', (e) => {
        e.preventDefault();
        updateFinancialOverview(new FormData(financialForm));
    });
}

// ========================================
// CLINICAL QUALITY CALCULATIONS
// ========================================

function updateClinicalQuality(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Calculate sessions realized from table
    const sessionsRealized = parseInt(data['sessions-mon']) + 
                             parseInt(data['sessions-tue']) + 
                             parseInt(data['sessions-wed']) + 
                             parseInt(data['sessions-thu']) + 
                             parseInt(data['sessions-fri']) + 
                             parseInt(data['sessions-sat']);
    
    const sessionsProgrammed = parseInt(data['sessions-programmed']);
    const sessionsCancelled = parseInt(data['sessions-cancelled']);
    const maxCapacity = 72; // Fixed capacity
    
    // Calculate KPIs
    const compliancePercentage = ((sessionsRealized / sessionsProgrammed) * 100).toFixed(1);
    const incidentRate = sessionsProgrammed > 0 ? ((sessionsCancelled / sessionsProgrammed) * 100).toFixed(1) : 0;
    const capacityUsed = ((sessionsRealized / maxCapacity) * 100).toFixed(1);
    
    // Update Display
    document.getElementById('sessions-realized-display').textContent = sessionsRealized;
    document.getElementById('sessions-vs-programmed').innerHTML = 
        `vs Programadas: ${sessionsProgrammed} (${compliancePercentage}%)`;
    
    document.getElementById('incident-rate').innerHTML = 
        `${incidentRate}<span class="metric-unit">%</span>`;
    document.getElementById('cancelled-sessions-display').textContent = 
        `${sessionsCancelled} Canceladas`;
    
    document.getElementById('capacity-used').innerHTML = 
        `${capacityUsed}<span class="metric-unit">%</span>`;
    
    // Update comparison colors
    updateComparisonColors(compliancePercentage, incidentRate);
    
    // Update Weekly Sessions Chart
    updateWeeklySessionsChart([
        parseInt(data['week-1']),
        parseInt(data['week-2']),
        parseInt(data['week-3']),
        parseInt(data['week-4']),
        parseInt(data['week-5']),
        parseInt(data['week-6'])
    ]);
    
    // Update Operational Metrics (auto-sync)
    updateOperationalMetrics({
        sessionsRealized,
        sessionsProgrammed,
        capacityUsed,
        sessionsByDay: [
            parseInt(data['sessions-mon']),
            parseInt(data['sessions-tue']),
            parseInt(data['sessions-wed']),
            parseInt(data['sessions-thu']),
            parseInt(data['sessions-fri']),
            parseInt(data['sessions-sat'])
        ],
        weeklyData: [
            parseInt(data['week-1']),
            parseInt(data['week-2']),
            parseInt(data['week-3']),
            parseInt(data['week-4']),
            parseInt(data['week-5']),
            parseInt(data['week-6'])
        ]
    });
    
    // Close modal
    document.getElementById('modalClinical').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Show success message
    showSuccessMessage('Datos de Calidad Clínica actualizados correctamente');
}

// ========================================
// OPERATIONAL METRICS UPDATE (Auto-sync from Clinical Quality)
// ========================================

function updateOperationalMetrics(data) {
    // Update Sesiones Esta Semana
    document.getElementById('op-sessions-week').textContent = data.sessionsRealized;
    document.getElementById('op-sessions-comparison').textContent = 
        `vs Programadas: ${data.sessionsProgrammed}`;
    
    // Update Capacidad de Utilización
    document.getElementById('op-capacity-percentage').textContent = data.capacityUsed;
    
    // Update gauge label based on capacity
    const capacityLabel = document.getElementById('op-capacity-label');
    if (data.capacityUsed >= 80) {
        capacityLabel.textContent = 'Excelente';
        capacityLabel.style.color = '#2ecc71';
    } else if (data.capacityUsed >= 60) {
        capacityLabel.textContent = 'Bueno';
        capacityLabel.style.color = '#f39c12';
    } else {
        capacityLabel.textContent = 'Bajo';
        capacityLabel.style.color = '#e74c3c';
    }
    
    // Update Operational Capacity Gauge
    updateOperationalGauge(parseFloat(data.capacityUsed));
    
    // Update Daily Sessions Chart
    updateDailySessionsChart(data.sessionsByDay);
    
    // Update Capacity Trend Chart
    updateCapacityTrendChart(data.weeklyData);
}

// ========================================
// PATIENT EXPERIENCE CALCULATIONS
// ========================================

function updatePatientExperience(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Parse data
    const amabilidad = {
        insatisfecho: parseInt(data['amabilidad-insatisfecho']),
        satisfecho: parseInt(data['amabilidad-satisfecho']),
        muySatisfecho: parseInt(data['amabilidad-muy-satisfecho'])
    };
    
    const limpieza = {
        insatisfecho: parseInt(data['limpieza-insatisfecho']),
        satisfecho: parseInt(data['limpieza-satisfecho']),
        muySatisfecho: parseInt(data['limpieza-muy-satisfecho'])
    };
    
    const puntualidad = {
        insatisfecho: parseInt(data['puntualidad-insatisfecho']),
        satisfecho: parseInt(data['puntualidad-satisfecho']),
        muySatisfecho: parseInt(data['puntualidad-muy-satisfecho'])
    };
    
    // Calculate totals
    const totalAmabilidad = amabilidad.insatisfecho + amabilidad.satisfecho + amabilidad.muySatisfecho;
    const totalLimpieza = limpieza.insatisfecho + limpieza.satisfecho + limpieza.muySatisfecho;
    const totalPuntualidad = puntualidad.insatisfecho + puntualidad.satisfecho + puntualidad.muySatisfecho;
    
    // Update display
    document.getElementById('amabilidad-total').textContent = `Total: ${totalAmabilidad} encuestas`;
    document.getElementById('limpieza-total').textContent = `Total: ${totalLimpieza} encuestas`;
    document.getElementById('puntualidad-total').textContent = `Total: ${totalPuntualidad} encuestas`;
    
    // Update charts
    updateSatisfactionChart('amabilidadChart', amabilidad, totalAmabilidad);
    updateSatisfactionChart('limpiezaChart', limpieza, totalLimpieza);
    updateSatisfactionChart('puntualidadChart', puntualidad, totalPuntualidad);
    updateComparisonChart(amabilidad, limpieza, puntualidad, totalAmabilidad, totalLimpieza, totalPuntualidad);
    
    // Close modal
    document.getElementById('modalPatient').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Show success message
    showSuccessMessage('Datos de Experiencia del Paciente actualizados correctamente');
}

// ========================================
// UPDATE COMPARISON COLORS
// ========================================

function updateComparisonColors(compliancePercentage, incidentRate) {
    const complianceComp = document.getElementById('sessions-vs-programmed').parentElement;
    const incidentComp = document.getElementById('cancelled-sessions-display').parentElement;
    
    // Update compliance color
    complianceComp.classList.remove('positive', 'negative');
    if (compliancePercentage >= 100) {
        complianceComp.classList.add('positive');
        complianceComp.querySelector('.arrow').textContent = '▲';
    } else {
        complianceComp.classList.add('negative');
        complianceComp.querySelector('.arrow').textContent = '▼';
    }
    
    // Update incident rate color
    incidentComp.classList.remove('positive', 'negative');
    if (incidentRate <= 5) {
        incidentComp.classList.add('positive');
    } else {
        incidentComp.classList.add('negative');
    }
}

// ========================================
// SUCCESS MESSAGE
// ========================================

function showSuccessMessage(message) {
    // Create temporary success notification
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2ecc71;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 10000;
        font-weight: 600;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// CHARTS INITIALIZATION
// ========================================

let weeklySessionsChart = null;
let amabilidadChart = null;
let limpiezaChart = null;
let puntualidadChart = null;
let satisfactionComparisonChart = null;
let operationalCapacityGauge = null;
let dailySessionsChart = null;
let capacityTrendChart = null;

function initializeCharts() {
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
    Chart.defaults.color = '#7f8c8d';
    
    initWeeklySessionsChart();
    initOperationalCharts();
    initSatisfactionCharts();
    initRevenueCostChart();
}

// ========================================
// OPERATIONAL METRICS CHARTS
// ========================================

function initOperationalCharts() {
    // Operational Capacity Gauge
    const gaugeCtx = document.getElementById('operationalCapacityGauge').getContext('2d');
    operationalCapacityGauge = new Chart(gaugeCtx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [59.7, 40.3],
                backgroundColor: ['#2ecc71', '#e1e8ed'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        }
    });
    
    // Daily Sessions Chart
    const dailyCtx = document.getElementById('dailySessionsChart').getContext('2d');
    dailySessionsChart = new Chart(dailyCtx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
            datasets: [{
                label: 'Sesiones',
                data: [12, 4, 7, 5, 8, 7],
                backgroundColor: '#1c5985',
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
    
    // Capacity Trend Chart
    const trendCtx = document.getElementById('capacityTrendChart').getContext('2d');
    capacityTrendChart = new Chart(trendCtx, {
        type: 'line',
        data: {
            labels: ['Sem -5', 'Sem -4', 'Sem -3', 'Sem -2', 'Sem -1', 'Actual'],
            datasets: [{
                label: 'Capacidad Utilizada',
                data: [52.8, 55.6, 58.3, 56.9, 54.2, 59.7],
                borderColor: '#1c5985',
                backgroundColor: 'rgba(28, 89, 133, 0.1)',
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#1c5985',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return 'Capacidad: ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    });
}

function updateOperationalGauge(percentage) {
    if (operationalCapacityGauge) {
        operationalCapacityGauge.data.datasets[0].data = [percentage, 100 - percentage];
        operationalCapacityGauge.update();
    }
}

function updateDailySessionsChart(data) {
    if (dailySessionsChart) {
        dailySessionsChart.data.datasets[0].data = data;
        dailySessionsChart.update();
    }
}

function updateCapacityTrendChart(weeklyData) {
    if (capacityTrendChart) {
        // Calculate capacity percentages from weekly session data
        const capacityPercentages = weeklyData.map(sessions => (sessions / 72 * 100).toFixed(1));
        capacityTrendChart.data.datasets[0].data = capacityPercentages;
        capacityTrendChart.update();
    }
}

// ========================================
// SATISFACTION CHARTS (Patient Experience)
// ========================================

function initSatisfactionCharts() {
    // Initialize individual satisfaction charts
    amabilidadChart = createSatisfactionChart('amabilidadChart', {
        insatisfecho: 0,
        satisfecho: 2,
        muySatisfecho: 11
    }, 13);
    
    limpiezaChart = createSatisfactionChart('limpiezaChart', {
        insatisfecho: 0,
        satisfecho: 4,
        muySatisfecho: 9
    }, 13);
    
    puntualidadChart = createSatisfactionChart('puntualidadChart', {
        insatisfecho: 0,
        satisfecho: 5,
        muySatisfecho: 8
    }, 13);
    
    // Initialize comparison chart
    initComparisonChart();
}

function createSatisfactionChart(canvasId, data, total) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    const percentages = {
        insatisfecho: total > 0 ? ((data.insatisfecho / total) * 100).toFixed(1) : 0,
        satisfecho: total > 0 ? ((data.satisfecho / total) * 100).toFixed(1) : 0,
        muySatisfecho: total > 0 ? ((data.muySatisfecho / total) * 100).toFixed(1) : 0
    };
    
    return new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Insatisfecho', 'Satisfecho', 'Muy Satisfecho'],
            datasets: [{
                label: 'Respuestas',
                data: [data.insatisfecho, data.satisfecho, data.muySatisfecho],
                backgroundColor: ['#e74c3c', '#f39c12', '#2ecc71'],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            const value = context.parsed.y;
                            const percentage = context.dataIndex === 0 ? percentages.insatisfecho :
                                             context.dataIndex === 1 ? percentages.satisfecho :
                                             percentages.muySatisfecho;
                            return `${value} respuestas (${percentage}%)`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateSatisfactionChart(chartVariable, data, total) {
    let chart;
    if (chartVariable === 'amabilidadChart') chart = amabilidadChart;
    else if (chartVariable === 'limpiezaChart') chart = limpiezaChart;
    else if (chartVariable === 'puntualidadChart') chart = puntualidadChart;
    
    if (chart) {
        chart.data.datasets[0].data = [data.insatisfecho, data.satisfecho, data.muySatisfecho];
        
        // Update tooltip percentages
        const percentages = {
            insatisfecho: total > 0 ? ((data.insatisfecho / total) * 100).toFixed(1) : 0,
            satisfecho: total > 0 ? ((data.satisfecho / total) * 100).toFixed(1) : 0,
            muySatisfecho: total > 0 ? ((data.muySatisfecho / total) * 100).toFixed(1) : 0
        };
        
        chart.options.plugins.tooltip.callbacks.label = function(context) {
            const value = context.parsed.y;
            const percentage = context.dataIndex === 0 ? percentages.insatisfecho :
                             context.dataIndex === 1 ? percentages.satisfecho :
                             percentages.muySatisfecho;
            return `${value} respuestas (${percentage}%)`;
        };
        
        chart.update();
    }
}

function initComparisonChart() {
    const ctx = document.getElementById('satisfactionComparisonChart').getContext('2d');
    
    satisfactionComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Amabilidad y Calidad', 'Limpieza e Higiene', 'Puntualidad'],
            datasets: [
                {
                    label: 'Insatisfecho',
                    data: [0, 0, 0],
                    backgroundColor: '#e74c3c',
                    borderRadius: 4
                },
                {
                    label: 'Satisfecho',
                    data: [15.4, 30.8, 38.5],
                    backgroundColor: '#f39c12',
                    borderRadius: 4
                },
                {
                    label: 'Muy Satisfecho',
                    data: [84.6, 69.2, 61.5],
                    backgroundColor: '#2ecc71',
                    borderRadius: 4
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.x.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    max: 100
                },
                y: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

function updateComparisonChart(amabilidad, limpieza, puntualidad, totalA, totalL, totalP) {
    if (satisfactionComparisonChart) {
        const calcPercentage = (value, total) => total > 0 ? (value / total) * 100 : 0;
        
        satisfactionComparisonChart.data.datasets[0].data = [
            calcPercentage(amabilidad.insatisfecho, totalA),
            calcPercentage(limpieza.insatisfecho, totalL),
            calcPercentage(puntualidad.insatisfecho, totalP)
        ];
        
        satisfactionComparisonChart.data.datasets[1].data = [
            calcPercentage(amabilidad.satisfecho, totalA),
            calcPercentage(limpieza.satisfecho, totalL),
            calcPercentage(puntualidad.satisfecho, totalP)
        ];
        
        satisfactionComparisonChart.data.datasets[2].data = [
            calcPercentage(amabilidad.muySatisfecho, totalA),
            calcPercentage(limpieza.muySatisfecho, totalL),
            calcPercentage(puntualidad.muySatisfecho, totalP)
        ];
        
        satisfactionComparisonChart.update();
    }
}

// ========================================
// WEEKLY SESSIONS CHART (Clinical Quality)
// ========================================

function initWeeklySessionsChart() {
    const ctx = document.getElementById('sessionsWeeklyChart').getContext('2d');
    
    weeklySessionsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Sem -5', 'Sem -4', 'Sem -3', 'Sem -2', 'Sem -1', 'Actual'],
            datasets: [{
                label: 'Sesiones',
                data: [38, 40, 42, 41, 39, 43],
                backgroundColor: [
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#2ecc71'
                ],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 72,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + ' sesiones';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Update weekly sessions chart with new data
function updateWeeklySessionsChart(data) {
    if (weeklySessionsChart) {
        weeklySessionsChart.data.datasets[0].data = data;
        weeklySessionsChart.update();
    }
}

// ========================================
// SESSIONS THIS WEEK CHART (Operational)
// ========================================

function initSessionsChart() {
    const ctx = document.getElementById('sessionsChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datasets: [{
                label: 'Sesiones',
                data: [52, 48, 55, 50, 60, 53, 32],
                backgroundColor: [
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#1c5985',
                    '#2ecc71'
                ],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// SATISFACTION TREND (NPS) CHART
// ========================================

function initSatisfactionTrendChart() {
    const ctx = document.getElementById('satisfactionTrendChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3'],
            datasets: [
                {
                    label: 'Promotores',
                    data: [65, 70, 68],
                    backgroundColor: '#2ecc71',
                    borderRadius: 4
                },
                {
                    label: 'Pasivos',
                    data: [20, 18, 20],
                    backgroundColor: '#f39c12',
                    borderRadius: 4
                },
                {
                    label: 'Detractores',
                    data: [15, 12, 12],
                    backgroundColor: '#e74c3c',
                    borderRadius: 4
                }
            ]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 15,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 }
                }
            },
            scales: {
                x: {
                    stacked: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                },
                y: {
                    stacked: true,
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// REVENUE & COST TREND CHART
// ========================================

function initRevenueCostChart() {
    const ctx = document.getElementById('revenueCostChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Jun', 'Feb', 'Mar', 'Abr', 'May'],
            datasets: [
                {
                    label: 'Ingresos',
                    data: [400, 420, 410, 430, 440],
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#2ecc71',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                },
                {
                    label: 'Costos',
                    data: [320, 330, 325, 335, 340],
                    borderColor: '#e74c3c',
                    backgroundColor: 'rgba(231, 76, 60, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointBackgroundColor: '#e74c3c',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointHoverRadius: 7
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        boxWidth: 15,
                        padding: 15,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': $' + context.parsed.y + 'K';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'K';
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================================
// CAPACITY GAUGE
// ========================================

function initCapacityGauge() {
    const ctx = document.getElementById('capacityGauge').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [88, 12],
                backgroundColor: [
                    '#2ecc71',
                    '#e1e8ed'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// ========================================
// NPS GAUGE
// ========================================

function initNPSGauge() {
    const ctx = document.getElementById('npsGauge').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [87, 13],
                backgroundColor: [
                    '#2ecc71',
                    '#e1e8ed'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            cutout: '75%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatCurrency(value) {
    return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

function formatPercentage(value, decimals = 0) {
    return value.toFixed(decimals) + '%';
}

function formatLargeNumber(value) {
    if (value >= 1000) {
        return '$' + (value / 1000).toFixed(0) + 'K';
    }
    return '$' + value;
}

console.log('Phase 2 Complete: Clinical Quality calculations implemented');
console.log('Remaining: Operational, Patient Experience, Financial calculations');

// ========================================
// FINANCIAL OVERVIEW CALCULATIONS
// ========================================

function updateFinancialOverview(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Get sessions from Clinical Quality (already saved)
    const sessionsRealized = parseInt(document.getElementById('sessions-realized-display').textContent) || 43;
    
    // Parse financial data
    const totalRevenue = parseFloat(data['total-revenue-fin']);
    const costPerSession = parseFloat(data['cost-per-session']);
    const targetRevenue = parseFloat(data['target-revenue-fin']);
    
    // Parse operational expenses
    const payrollOps = parseFloat(data['payroll-operations']);
    const payrollAdmin = parseFloat(data['payroll-admin']);
    const generalServices = parseFloat(data['general-services']);
    const insurancePolicies = parseFloat(data['insurance-policies']);
    
    // Calculate inventory cost from table
    let inventoryCost = 0;
    const items = [
        'filtro', 'heparina', 'acido-potasio', 'bicarbonato', 'lineas',
        'kit-cateter', 'solucion-fisio', 'acido-citrico', 'clorhexedina',
        'normogotero', 'jeringa-10', 'aguja-arterial', 'aguja-venosa',
        'aguja-hipo', 'kit-fistula', 'jabon-clorhex'
    ];
    
    items.forEach(item => {
        const qtyInput = document.querySelector(`input[data-item="${item}"].inv-qty`);
        const priceInput = document.querySelector(`input[data-item="${item}"].inv-price`);
        const qty = parseFloat(qtyInput.value) || 0;
        const price = parseFloat(priceInput.value) || 0;
        inventoryCost += (qty * price);
    });
    
    // Calculate KPIs
    const revenuePerSession = (totalRevenue / sessionsRealized).toFixed(2);
    const totalCosts = inventoryCost + payrollOps + payrollAdmin + generalServices + insurancePolicies;
    const netProfit = totalRevenue - totalCosts;
    const profitMargin = ((netProfit / totalRevenue) * 100).toFixed(1);
    
    // Update Display
    document.getElementById('revenue-session').textContent = '$' + formatNumber(revenuePerSession);
    document.getElementById('cost-session').textContent = '$' + formatNumber(costPerSession);
    document.getElementById('weekly-revenue').textContent = '$' + formatNumber(totalRevenue);
    document.getElementById('net-profit').textContent = '$' + formatNumber(netProfit);
    document.getElementById('profit-margin').innerHTML = profitMargin + '<span class="metric-unit">%</span>';
    document.getElementById('inventory-cost').textContent = '$' + formatNumber(inventoryCost);
    
    // Update comparisons
    const revenueComp = document.getElementById('weekly-revenue-comparison');
    const targetDiff = totalRevenue - targetRevenue;
    if (targetDiff >= 0) {
        revenueComp.parentElement.classList.add('positive');
        revenueComp.parentElement.classList.remove('negative');
        revenueComp.innerHTML = '<span class="arrow">▲</span><span>vs Meta: $' + formatNumber(targetRevenue) + '</span>';
    } else {
        revenueComp.parentElement.classList.add('negative');
        revenueComp.parentElement.classList.remove('positive');
        revenueComp.innerHTML = '<span class="arrow">▼</span><span>vs Meta: $' + formatNumber(targetRevenue) + '</span>';
    }
    
    // Update profit comparison
    const profitComp = document.getElementById('net-profit').nextElementSibling;
    if (netProfit >= 0) {
        profitComp.classList.add('positive');
        profitComp.classList.remove('negative');
        profitComp.querySelector('.arrow').textContent = '▲';
    } else {
        profitComp.classList.add('negative');
        profitComp.classList.remove('positive');
        profitComp.querySelector('.arrow').textContent = '▼';
    }
    
    // Close modal
    document.getElementById('modalFinancial').classList.remove('active');
    document.body.style.overflow = 'auto';
    
    // Show success message
    showSuccessMessage('Datos de Panorama Financiero actualizados correctamente');
}

// Format number with commas
function formatNumber(num) {
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

console.log('Phase 2 Complete: All 4 quadrants functional!');