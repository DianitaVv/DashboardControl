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
    
    // Initialize Adverse Events Table Auto-calculation
    initializeAdverseEventsTableCalc();
    
    // Initialize Dynamic Weeks Fields
    initializeDynamicWeeks();
    
    // Initialize Dynamic Weeks for Operational Metrics
    initializeDynamicWeeksOperational();
    
    // Initialize Dynamic Weeks for Financial Overview
    initializeDynamicWeeksFinancial();
});

// ========================================
// ADVERSE EVENTS TABLE AUTO-CALCULATION
// ========================================

function initializeAdverseEventsTableCalc() {
    const adverseInputs = [
        'adverse-mon',
        'adverse-tue',
        'adverse-wed',
        'adverse-thu',
        'adverse-fri',
        'adverse-sat'
    ];
    
    const totalDisplay = document.getElementById('adverse-week-total');
    
    adverseInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', () => {
                let total = 0;
                adverseInputs.forEach(id => {
                    const val = parseInt(document.getElementById(id).value) || 0;
                    total += val;
                });
                if (totalDisplay) {
                    totalDisplay.textContent = total;
                }
            });
        }
    });
}

// ========================================
// DYNAMIC WEEKS FIELDS GENERATION
// ========================================

function initializeDynamicWeeks() {
    const numWeeksInput = document.getElementById('num-weeks');
    const container = document.getElementById('weekly-adverse-container');
    
    if (numWeeksInput && container) {
        numWeeksInput.addEventListener('change', () => {
            const numWeeks = parseInt(numWeeksInput.value) || 2;
            generateWeekFields(numWeeks, container);
        });
    }
}

function generateWeekFields(numWeeks, container) {
    // Clear existing fields
    container.innerHTML = '';
    
    // Create grid container
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    
    // Generate fields for each week
    for (let i = 1; i <= numWeeks; i++) {
        const field = document.createElement('div');
        field.className = 'form-field';
        
        const label = document.createElement('label');
        label.setAttribute('for', `adverse-week-${i}`);
        label.textContent = `Semana ${i}`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `adverse-week-${i}`;
        input.name = `adverse-week-${i}`;
        input.step = '1';
        input.min = '0';
        input.value = i <= 2 ? (i === 1 ? '3' : '2') : '0';
        input.required = true;
        
        field.appendChild(label);
        field.appendChild(input);
        grid.appendChild(field);
    }
    
    container.appendChild(grid);
}

// ========================================
// INVENTORY TABLE AUTO-CALCULATION (REMOVED - NOT USED)
// ========================================

// Function removed - inventory table eliminated from Financial Overview

// ========================================
// TOOLTIP SYSTEM
// ========================================

function initializeTooltips() {
    const tooltipIcons = document.querySelectorAll('.tooltip-icon');
    const tooltipContainer = document.getElementById('tooltipContainer');
    
    if (tooltipContainer) {
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
}

// ========================================
// MODAL CONTROLS
// ========================================

function initializeModals() {
    const sections = ['clinical', 'operational', 'patient', 'financial'];
    
    sections.forEach(section => {
        const modal = document.getElementById(`modal${capitalize(section)}`);
        const openBtn = document.querySelector(`button[data-section="${section}"]`);
        const closeBtn = document.querySelector(`button[data-close="${section}"]`);
        const cancelBtn = document.querySelector(`button[data-cancel="${section}"]`);
        
        if (modal && openBtn) {
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
            
            if (closeBtn) {
                closeBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeModal();
                });
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    closeModal();
                });
            }
            
            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeModal();
                }
            });
        }
    });
    
    // Close any modal with ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            sections.forEach(section => {
                const modal = document.getElementById(`modal${capitalize(section)}`);
                if (modal && modal.classList.contains('active')) {
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
    if (clinicalForm) {
        clinicalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateClinicalQuality(new FormData(clinicalForm));
        });
    }
    
    // Operational Metrics Form
    const operationalForm = document.getElementById('formOperational');
    if (operationalForm) {
        operationalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateOperationalMetrics(new FormData(operationalForm));
        });
    }
    
    // Patient Experience Form
    const patientForm = document.getElementById('formPatient');
    if (patientForm) {
        patientForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updatePatientExperience(new FormData(patientForm));
        });
    }
    
    // Financial Overview Form
    const financialForm = document.getElementById('formFinancial');
    if (financialForm) {
        financialForm.addEventListener('submit', (e) => {
            e.preventDefault();
            updateFinancialOverview(new FormData(financialForm));
        });
    }
}

// ========================================
// CLINICAL QUALITY CALCULATIONS (UPDATED)
// ========================================

function updateClinicalQuality(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Get infection rate data
    const infectionRate = parseFloat(data['infection-rate-value']);
    const infectionGoal = parseFloat(data['infection-rate-goal']);
    
    // Get adverse events by day
    const adverseTotal = parseInt(data['adverse-mon']) + 
                        parseInt(data['adverse-tue']) + 
                        parseInt(data['adverse-wed']) + 
                        parseInt(data['adverse-thu']) + 
                        parseInt(data['adverse-fri']) + 
                        parseInt(data['adverse-sat']);
    
    // Get days with events
    const daysWithEvents = [];
    const dayNames = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const dayKeys = ['adverse-mon', 'adverse-tue', 'adverse-wed', 'adverse-thu', 'adverse-fri', 'adverse-sat'];
    
    dayKeys.forEach((key, index) => {
        if (parseInt(data[key]) > 0) {
            daysWithEvents.push(dayNames[index]);
        }
    });
    
    const daysText = daysWithEvents.length > 0 ? daysWithEvents.join(', ') : 'Ninguno';
    
    // Get alarms data
    const alarmsTotal = parseInt(data['alarms-total']);
    const alarmsResolvedPct = parseInt(data['alarms-resolved-pct']);
    
    // Get weekly adverse events for chart
    const numWeeks = parseInt(data['num-weeks']) || 2;
    const weeklyAdverse = [];
    for (let i = 1; i <= numWeeks; i++) {
        weeklyAdverse.push(parseInt(data[`adverse-week-${i}`]) || 0);
    }
    
    // Update Display
    const infectionRateEl = document.getElementById('infection-rate');
    if (infectionRateEl) {
        infectionRateEl.innerHTML = infectionRate.toFixed(2) + '<span class="metric-unit">%</span>';
    }
    
    // Update infection rate comparison
    const infectionComp = infectionRateEl ? infectionRateEl.nextElementSibling.nextElementSibling : null;
    if (infectionComp) {
        infectionComp.classList.remove('positive', 'negative');
        if (infectionRate < infectionGoal) {
            infectionComp.classList.add('positive');
        } else {
            infectionComp.classList.add('negative');
        }
        infectionComp.querySelector('span:last-child').textContent = `Meta Semanal: menor a ${infectionGoal.toFixed(2)}%`;
    }
    
    // Update adverse events
    const adverseEl = document.getElementById('adverse-events');
    if (adverseEl) {
        adverseEl.textContent = adverseTotal;
    }
    
    // Update adverse events days
    const adverseDaysEl = document.getElementById('adverse-events-days');
    if (adverseDaysEl) {
        adverseDaysEl.textContent = daysText;
    }
    
    // Update alarms
    const alarmsEl = document.getElementById('treatment-alarms');
    if (alarmsEl) {
        alarmsEl.textContent = alarmsTotal;
    }
    
    const alarmsStatus = alarmsEl ? alarmsEl.nextElementSibling : null;
    if (alarmsStatus) {
        alarmsStatus.querySelector('strong').textContent = `${alarmsResolvedPct}%`;
    }
    
    // Update Adverse Events Chart
    updateAdverseEventsChart(weeklyAdverse);
    
    // Close modal
    const modal = document.getElementById('modalClinical');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Show success message
    showSuccessMessage('Datos de Calidad Clínica actualizados correctamente');
}

// ========================================
// SUCCESS MESSAGE
// ========================================

function showSuccessMessage(message) {
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

let adverseEventsChart = null;
let amabilidadChart = null;
let limpiezaChart = null;
let puntualidadChart = null;
let satisfactionComparisonChart = null;
let operationalCapacityGauge = null;
let activePatientsChart = null;
let capacityUtilizationChart = null;
let npsGauge = null;
let revenueCostChart = null;
let netProfitChart = null;

function initializeCharts() {
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
    Chart.defaults.color = '#7f8c8d';
    
    initAdverseEventsChart();
    initOperationalCharts();
    initSatisfactionCharts();
    initNPSGauge();
    initRevenueCostChart();
    initNetProfitChart();
}

// ========================================
// ADVERSE EVENTS CHART (Clinical Quality)
// ========================================

function initAdverseEventsChart() {
    const canvas = document.getElementById('adverseEventsChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    adverseEventsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2'],
            datasets: [{
                label: 'Eventos Adversos',
                data: [3, 2],
                backgroundColor: ['#e74c3c', '#e74c3c'],
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

function updateAdverseEventsChart(data) {
    if (adverseEventsChart) {
        const labels = data.map((_, i) => `Semana ${i + 1}`);
        adverseEventsChart.data.labels = labels;
        adverseEventsChart.data.datasets[0].data = data;
        adverseEventsChart.update();
    }
}

// ========================================
// OPERATIONAL METRICS CHARTS
// ========================================

function initOperationalCharts() {
    // Operational Capacity Gauge
    const gaugeCanvas = document.getElementById('operationalCapacityGauge');
    if (gaugeCanvas) {
        const gaugeCtx = gaugeCanvas.getContext('2d');
        operationalCapacityGauge = new Chart(gaugeCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [88, 12],
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
    }
    
    // Active Patients Chart
    const activePatientsCanvas = document.getElementById('activePatientsChart');
    if (activePatientsCanvas) {
        const ctx = activePatientsCanvas.getContext('2d');
        activePatientsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [{
                    label: 'Pacientes Activos',
                    data: [125, 128, 129, 134],
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
                        grid: { color: 'rgba(0, 0, 0, 0.05)' }
                    },
                    x: {
                        grid: { display: false }
                    }
                }
            }
        });
    }
    
    // Capacity Utilization Chart
    const capacityUtilCanvas = document.getElementById('capacityUtilizationChart');
    if (capacityUtilCanvas) {
        const ctx = capacityUtilCanvas.getContext('2d');
        capacityUtilizationChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                datasets: [{
                    label: 'Capacidad Utilizada',
                    data: [82, 85, 87, 88],
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
}

function updateActivePatientsChart(data) {
    if (activePatientsChart) {
        const labels = data.map((_, i) => `Semana ${i + 1}`);
        activePatientsChart.data.labels = labels;
        activePatientsChart.data.datasets[0].data = data;
        activePatientsChart.update();
    }
}

function updateCapacityUtilizationChart(data) {
    if (capacityUtilizationChart) {
        const labels = data.map((_, i) => `Semana ${i + 1}`);
        capacityUtilizationChart.data.labels = labels;
        capacityUtilizationChart.data.datasets[0].data = data;
        capacityUtilizationChart.update();
    }
}

// ========================================
// SATISFACTION CHARTS (Patient Experience)
// ========================================

function initSatisfactionCharts() {
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
    
    initComparisonChart();
}

function createSatisfactionChart(canvasId, data, total) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return null;
    
    const ctx = canvas.getContext('2d');
    
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
    const canvas = document.getElementById('satisfactionComparisonChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
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
// PATIENT EXPERIENCE CALCULATIONS
// ========================================

function updatePatientExperience(formData) {
    const data = Object.fromEntries(formData.entries());
    
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
    
    const totalAmabilidad = amabilidad.insatisfecho + amabilidad.satisfecho + amabilidad.muySatisfecho;
    const totalLimpieza = limpieza.insatisfecho + limpieza.satisfecho + limpieza.muySatisfecho;
    const totalPuntualidad = puntualidad.insatisfecho + puntualidad.satisfecho + puntualidad.muySatisfecho;
    
    // Calculate NPS (average of "Muy Satisfecho" percentages)
    const pctAmabilidad = totalAmabilidad > 0 ? (amabilidad.muySatisfecho / totalAmabilidad) * 100 : 0;
    const pctLimpieza = totalLimpieza > 0 ? (limpieza.muySatisfecho / totalLimpieza) * 100 : 0;
    const pctPuntualidad = totalPuntualidad > 0 ? (puntualidad.muySatisfecho / totalPuntualidad) * 100 : 0;
    const npsScore = Math.round((pctAmabilidad + pctLimpieza + pctPuntualidad) / 3);
    
    // Calculate Retention
    const patientsCurrent = parseInt(data['patients-current']);
    const patientsEndMonth = parseInt(data['patients-end-month']);
    const retentionPct = patientsCurrent > 0 ? ((patientsEndMonth / patientsCurrent) * 100).toFixed(1) : 0;
    
    // Update NPS Display
    const npsScoreEl = document.getElementById('nps-score');
    if (npsScoreEl) {
        npsScoreEl.textContent = npsScore;
    }
    updateNPSGauge(npsScore);
    
    // Update Retention Display
    const retentionEl = document.getElementById('patient-retention');
    if (retentionEl) {
        retentionEl.innerHTML = retentionPct + '<span class="metric-unit">%</span>';
    }
    
    // Update retention comparison color
    const retentionComp = retentionEl ? retentionEl.nextElementSibling : null;
    if (retentionComp) {
        retentionComp.classList.remove('positive', 'negative');
        if (retentionPct >= 90) {
            retentionComp.classList.add('positive');
        } else {
            retentionComp.classList.add('negative');
        }
    }
    
    // Update category totals
    const amabilidadTotal = document.getElementById('amabilidad-total');
    const limpiezaTotal = document.getElementById('limpieza-total');
    const puntualidadTotal = document.getElementById('puntualidad-total');
    
    if (amabilidadTotal) amabilidadTotal.textContent = `Total: ${totalAmabilidad} encuestas`;
    if (limpiezaTotal) limpiezaTotal.textContent = `Total: ${totalLimpieza} encuestas`;
    if (puntualidadTotal) puntualidadTotal.textContent = `Total: ${totalPuntualidad} encuestas`;
    
    // Update charts
    updateSatisfactionChart('amabilidadChart', amabilidad, totalAmabilidad);
    updateSatisfactionChart('limpiezaChart', limpieza, totalLimpieza);
    updateSatisfactionChart('puntualidadChart', puntualidad, totalPuntualidad);
    updateComparisonChart(amabilidad, limpieza, puntualidad, totalAmabilidad, totalLimpieza, totalPuntualidad);
    
    // Close modal
    const modal = document.getElementById('modalPatient');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    showSuccessMessage('Datos de Experiencia del Paciente actualizados correctamente');
}

// ========================================
// REVENUE & COST TREND CHART
// ========================================

function initRevenueCostChart() {
    const canvas = document.getElementById('revenueCostChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    revenueCostChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
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

function updateRevenueCostChart(revenueData, costData) {
    if (revenueCostChart) {
        const labels = revenueData.map((_, i) => `Semana ${i + 1}`);
        revenueCostChart.data.labels = labels;
        revenueCostChart.data.datasets[0].data = revenueData;
        revenueCostChart.data.datasets[1].data = costData;
        revenueCostChart.update();
    }
}

// ========================================
// NET PROFIT CHART
// ========================================

function initNetProfitChart() {
    const canvas = document.getElementById('netProfitChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    netProfitChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4', 'Semana 5'],
            datasets: [{
                label: 'Utilidad Neta',
                data: [80, 90, 85, 95, 100],
                backgroundColor: '#2ecc71',
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
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            return 'Utilidad: $' + context.parsed.y + 'K';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' },
                    ticks: {
                        callback: function(value) {
                            return '$' + value + 'K';
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

function updateNetProfitChart(data) {
    if (netProfitChart) {
        const labels = data.map((_, i) => `Semana ${i + 1}`);
        netProfitChart.data.labels = labels;
        netProfitChart.data.datasets[0].data = data;
        netProfitChart.update();
    }
}

// ========================================
// FINANCIAL OVERVIEW CALCULATIONS
// ========================================

function updateFinancialOverview(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Get main data
    const publicCost = parseFloat(data['public-cost']);
    const publicCostPrevious = parseFloat(data['public-cost-previous']);
    const costPerSession = parseFloat(data['cost-per-session-fin']);
    const sessionsWeek = parseInt(data['sessions-week-fin']);
    const targetRevenue = parseFloat(data['target-revenue-fin']);
    
    // Calculate KPIs
    const weeklyRevenue = publicCost * sessionsWeek;
    const utilityPerSession = publicCost - costPerSession;
    const profitMargin = publicCost > 0 ? ((utilityPerSession / publicCost) * 100).toFixed(1) : 0;
    
    // Get historical data
    const numWeeksRevenue = parseInt(data['num-weeks-revenue']) || 5;
    const revenueData = [];
    const costData = [];
    for (let i = 1; i <= numWeeksRevenue; i++) {
        revenueData.push(parseInt(data[`revenue-week-${i}`]) || 0);
        costData.push(parseInt(data[`cost-week-${i}`]) || 0);
    }
    
    const numWeeksProfit = parseInt(data['num-weeks-profit']) || 5;
    const profitData = [];
    for (let i = 1; i <= numWeeksProfit; i++) {
        profitData.push(parseInt(data[`profit-week-${i}`]) || 0);
    }
    
    // Update Display - Costo al Público
    const revenueSessionEl = document.getElementById('revenue-session');
    if (revenueSessionEl) {
        revenueSessionEl.textContent = '$' + formatNumber(publicCost);
    }
    
    const revenueCompEl = document.getElementById('revenue-session-comparison');
    if (revenueCompEl) {
        revenueCompEl.textContent = `Última Semana: $${formatNumber(publicCostPrevious)}`;
        const compEl = revenueCompEl.parentElement;
        compEl.classList.remove('positive', 'negative');
        if (publicCost >= publicCostPrevious) {
            compEl.classList.add('positive');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
        } else {
            compEl.classList.add('negative');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
        }
    }
    
    // Update Cost Per Session
    const costSessionEl = document.getElementById('cost-session');
    if (costSessionEl) {
        costSessionEl.textContent = '$' + formatNumber(costPerSession);
    }
    
    // Update Weekly Revenue
    const weeklyRevenueEl = document.getElementById('weekly-revenue');
    if (weeklyRevenueEl) {
        weeklyRevenueEl.textContent = '$' + formatLargeNumber(weeklyRevenue);
    }
    
    const weeklyRevenueCompEl = document.getElementById('weekly-revenue-comparison');
    if (weeklyRevenueCompEl) {
        const targetDiff = weeklyRevenue - targetRevenue;
        weeklyRevenueCompEl.textContent = `vs Meta: $${formatLargeNumber(targetRevenue)}`;
        const compEl = weeklyRevenueCompEl.parentElement;
        compEl.classList.remove('positive', 'negative');
        if (targetDiff >= 0) {
            compEl.classList.add('positive');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
        } else {
            compEl.classList.add('negative');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
        }
    }
    
    // Update Net Profit (Utility per Session)
    const netProfitEl = document.getElementById('net-profit');
    if (netProfitEl) {
        netProfitEl.textContent = '$' + formatNumber(utilityPerSession);
    }
    
    const netProfitCompEl = netProfitEl ? netProfitEl.nextElementSibling : null;
    if (netProfitCompEl) {
        netProfitCompEl.classList.remove('positive', 'negative');
        if (utilityPerSession >= 0) {
            netProfitCompEl.classList.add('positive');
            const arrow = netProfitCompEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
        } else {
            netProfitCompEl.classList.add('negative');
            const arrow = netProfitCompEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
        }
    }
    
    // Update Profit Margin
    const profitMarginEl = document.getElementById('profit-margin');
    if (profitMarginEl) {
        profitMarginEl.innerHTML = profitMargin + '<span class="metric-unit">%</span>';
    }
    
    // Update Charts
    updateRevenueCostChart(revenueData, costData);
    updateNetProfitChart(profitData);
    
    // Close modal
    const modal = document.getElementById('modalFinancial');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    showSuccessMessage('Datos de Panorama Financiero actualizados correctamente');
}


// ========================================
// UTILITY FUNCTIONS
// ========================================

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatNumber(num) {
    return parseFloat(num).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function formatLargeNumber(value) {
    if (value >= 1000) {
        return (value / 1000).toFixed(0) + 'K';
    }
    return value.toFixed(0);
}

console.log('Phase 2 Complete: All 4 quadrants functional!');

// ========================================
// NPS GAUGE (Patient Experience)
// ========================================

function initNPSGauge() {
    const canvas = document.getElementById('npsGauge');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    npsGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [87, 13],
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
}

function updateNPSGauge(percentage) {
    if (npsGauge) {
        npsGauge.data.datasets[0].data = [percentage, 100 - percentage];
        npsGauge.update();
    }
    
    // Update NPS label
    const npsLabel = document.getElementById('nps-label');
    if (npsLabel) {
        if (percentage >= 80) {
            npsLabel.textContent = 'Excelente';
            npsLabel.style.color = '#2ecc71';
        } else if (percentage >= 60) {
            npsLabel.textContent = 'Bueno';
            npsLabel.style.color = '#f39c12';
        } else {
            npsLabel.textContent = 'Regular';
            npsLabel.style.color = '#e74c3c';
        }
    }
}

// ========================================
// DYNAMIC WEEKS FIELDS FOR OPERATIONAL METRICS
// ========================================

function initializeDynamicWeeksOperational() {
    // For Patients Active
    const numWeeksPatientsInput = document.getElementById('num-weeks-patients');
    const patientsContainer = document.getElementById('weekly-patients-container');
    
    if (numWeeksPatientsInput && patientsContainer) {
        numWeeksPatientsInput.addEventListener('change', () => {
            const numWeeks = parseInt(numWeeksPatientsInput.value) || 2;
            generatePatientsWeekFields(numWeeks, patientsContainer);
        });
    }
    
    // For Capacity Utilization
    const numWeeksCapacityInput = document.getElementById('num-weeks-capacity');
    const capacityContainer = document.getElementById('weekly-capacity-container');
    
    if (numWeeksCapacityInput && capacityContainer) {
        numWeeksCapacityInput.addEventListener('change', () => {
            const numWeeks = parseInt(numWeeksCapacityInput.value) || 2;
            generateCapacityWeekFields(numWeeks, capacityContainer);
        });
    }
}

function generatePatientsWeekFields(numWeeks, container) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    
    for (let i = 1; i <= numWeeks; i++) {
        const field = document.createElement('div');
        field.className = 'form-field';
        
        const label = document.createElement('label');
        label.setAttribute('for', `patients-week-${i}`);
        label.textContent = `Semana ${i}`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `patients-week-${i}`;
        input.name = `patients-week-${i}`;
        input.step = '1';
        input.min = '0';
        input.value = i <= 4 ? (120 + i * 3) : '0';
        input.required = true;
        
        field.appendChild(label);
        field.appendChild(input);
        grid.appendChild(field);
    }
    
    container.appendChild(grid);
}

function generateCapacityWeekFields(numWeeks, container) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    
    for (let i = 1; i <= numWeeks; i++) {
        const field = document.createElement('div');
        field.className = 'form-field';
        
        const label = document.createElement('label');
        label.setAttribute('for', `capacity-week-${i}`);
        label.textContent = `Semana ${i} (%)`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `capacity-week-${i}`;
        input.name = `capacity-week-${i}`;
        input.step = '0.1';
        input.min = '0';
        input.max = '100';
        input.value = i <= 4 ? (80 + i * 2) : '0';
        input.required = true;
        
        field.appendChild(label);
        field.appendChild(input);
        grid.appendChild(field);
    }
    
    container.appendChild(grid);
}

// ========================================
// OPERATIONAL METRICS CALCULATIONS
// ========================================

function updateOperationalMetrics(formData) {
    const data = Object.fromEntries(formData.entries());
    
    // Calculate Machine Utilization
    const hoursTreatment = parseFloat(data['hours-treatment']);
    const hoursAvailable = parseFloat(data['hours-available']);
    const machineUtilTarget = parseFloat(data['machine-util-target']);
    const machineUtil = hoursAvailable > 0 ? ((hoursTreatment / hoursAvailable) * 100).toFixed(1) : 0;
    
    // Get Cancellations
    const cancellations = parseInt(data['cancellations-count']);
    
    // Get Active Patients
    const activeCurrent = parseInt(data['active-patients-current']);
    const activePrevious = parseInt(data['active-patients-previous']);
    const activeDiff = activeCurrent - activePrevious;
    
    // Calculate Capacity Utilization
    const sessionsRealized = parseInt(data['sessions-realized-op']);
    const maxCapacity = parseInt(data['max-capacity-op']);
    const capacityUtil = maxCapacity > 0 ? ((sessionsRealized / maxCapacity) * 100).toFixed(1) : 0;
    
    // Get historical data
    const numWeeksPatients = parseInt(data['num-weeks-patients']) || 4;
    const weeklyPatients = [];
    for (let i = 1; i <= numWeeksPatients; i++) {
        weeklyPatients.push(parseInt(data[`patients-week-${i}`]) || 0);
    }
    
    const numWeeksCapacity = parseInt(data['num-weeks-capacity']) || 4;
    const weeklyCapacity = [];
    for (let i = 1; i <= numWeeksCapacity; i++) {
        weeklyCapacity.push(parseFloat(data[`capacity-week-${i}`]) || 0);
    }
    
    // Update Display - Machine Utilization
    const machineUtilEl = document.getElementById('machine-utilization');
    if (machineUtilEl) {
        machineUtilEl.innerHTML = machineUtil + '<span class="metric-unit">%</span>';
    }
    
    const machineUtilComp = document.getElementById('machine-util-comparison');
    if (machineUtilComp) {
        machineUtilComp.textContent = `vs Meta: ${machineUtilTarget}%`;
        const compEl = machineUtilComp.parentElement;
        compEl.classList.remove('positive', 'negative');
        if (parseFloat(machineUtil) >= machineUtilTarget) {
            compEl.classList.add('positive');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
        } else {
            compEl.classList.add('negative');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
        }
    }
    
    // Update Cancellations
    const cancellationsEl = document.getElementById('cancellations');
    if (cancellationsEl) {
        cancellationsEl.textContent = cancellations;
    }
    
    // Update Active Patients
    const activePatientsEl = document.getElementById('active-patients-op');
    if (activePatientsEl) {
        activePatientsEl.textContent = activeCurrent;
    }
    
    const activeChangeEl = document.getElementById('active-patients-change');
    if (activeChangeEl) {
        const sign = activeDiff >= 0 ? '+' : '';
        activeChangeEl.textContent = `${sign}${activeDiff} Esta Semana`;
        const compEl = activeChangeEl.parentElement;
        compEl.classList.remove('positive', 'negative');
        if (activeDiff >= 0) {
            compEl.classList.add('positive');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▲';
        } else {
            compEl.classList.add('negative');
            const arrow = compEl.querySelector('.arrow');
            if (arrow) arrow.textContent = '▼';
        }
    }
    
    // Update Capacity Gauge
    const capacityPctEl = document.getElementById('op-capacity-percentage');
    if (capacityPctEl) {
        capacityPctEl.textContent = capacityUtil;
    }
    
    const capacityLabel = document.getElementById('op-capacity-label');
    if (capacityLabel) {
        if (capacityUtil >= 80) {
            capacityLabel.textContent = 'Excelente';
            capacityLabel.style.color = '#2ecc71';
        } else if (capacityUtil >= 60) {
            capacityLabel.textContent = 'Bueno';
            capacityLabel.style.color = '#f39c12';
        } else {
            capacityLabel.textContent = 'Bajo';
            capacityLabel.style.color = '#e74c3c';
        }
    }
    
    // Update Operational Capacity Gauge
    updateOperationalGauge(parseFloat(capacityUtil));
    
    // Update Charts
    updateActivePatientsChart(weeklyPatients);
    updateCapacityUtilizationChart(weeklyCapacity);
    
    // Close modal
    const modal = document.getElementById('modalOperational');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    showSuccessMessage('Datos de Métricas Operacionales actualizados correctamente');
}

function updateOperationalGauge(percentage) {
    if (operationalCapacityGauge) {
        operationalCapacityGauge.data.datasets[0].data = [percentage, 100 - percentage];
        operationalCapacityGauge.update();
    }
}

// ========================================
// DYNAMIC WEEKS FOR FINANCIAL OVERVIEW
// ========================================

function initializeDynamicWeeksFinancial() {
    // For Revenue & Cost Trend
    const numWeeksRevenueInput = document.getElementById('num-weeks-revenue');
    const revenueContainer = document.getElementById('weekly-revenue-cost-container');
    
    if (numWeeksRevenueInput && revenueContainer) {
        numWeeksRevenueInput.addEventListener('change', () => {
            const numWeeks = parseInt(numWeeksRevenueInput.value) || 5;
            generateRevenueCostFields(numWeeks, revenueContainer);
        });
    }
    
    // For Net Profit
    const numWeeksProfitInput = document.getElementById('num-weeks-profit');
    const profitContainer = document.getElementById('weekly-profit-container');
    
    if (numWeeksProfitInput && profitContainer) {
        numWeeksProfitInput.addEventListener('change', () => {
            const numWeeks = parseInt(numWeeksProfitInput.value) || 5;
            generateProfitFields(numWeeks, profitContainer);
        });
    }
}

function generateRevenueCostFields(numWeeks, container) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    
    for (let i = 1; i <= numWeeks; i++) {
        // Revenue field
        const revenueField = document.createElement('div');
        revenueField.className = 'form-field';
        const revenueLabel = document.createElement('label');
        revenueLabel.setAttribute('for', `revenue-week-${i}`);
        revenueLabel.textContent = `Ingresos Semana ${i} ($K)`;
        const revenueInput = document.createElement('input');
        revenueInput.type = 'number';
        revenueInput.id = `revenue-week-${i}`;
        revenueInput.name = `revenue-week-${i}`;
        revenueInput.step = '1';
        revenueInput.min = '0';
        revenueInput.value = 400 + (i * 10);
        revenueInput.required = true;
        revenueField.appendChild(revenueLabel);
        revenueField.appendChild(revenueInput);
        grid.appendChild(revenueField);
        
        // Cost field
        const costField = document.createElement('div');
        costField.className = 'form-field';
        const costLabel = document.createElement('label');
        costLabel.setAttribute('for', `cost-week-${i}`);
        costLabel.textContent = `Costos Semana ${i} ($K)`;
        const costInput = document.createElement('input');
        costInput.type = 'number';
        costInput.id = `cost-week-${i}`;
        costInput.name = `cost-week-${i}`;
        costInput.step = '1';
        costInput.min = '0';
        costInput.value = 320 + (i * 5);
        costInput.required = true;
        costField.appendChild(costLabel);
        costField.appendChild(costInput);
        grid.appendChild(costField);
    }
    
    container.appendChild(grid);
}

function generateProfitFields(numWeeks, container) {
    container.innerHTML = '';
    const grid = document.createElement('div');
    grid.className = 'form-grid';
    
    for (let i = 1; i <= numWeeks; i++) {
        const field = document.createElement('div');
        field.className = 'form-field';
        const label = document.createElement('label');
        label.setAttribute('for', `profit-week-${i}`);
        label.textContent = `Utilidad Semana ${i} ($K)`;
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `profit-week-${i}`;
        input.name = `profit-week-${i}`;
        input.step = '1';
        input.min = '0';
        input.value = 80 + (i * 5);
        input.required = true;
        field.appendChild(label);
        field.appendChild(input);
        grid.appendChild(field);
    }
    
    container.appendChild(grid);
}