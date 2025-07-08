import { ITEMS } from './data/items.js';
import { MONSTERS } from './data/monsters.js';
import { REALMS } from './data/realms.js';
import { STATS } from './data/stat_pools.js';

document.addEventListener('DOMContentLoaded', () => {

    // --- STEP 1: Determine the minimum drop level and realm for every item ---
    const itemDropInfo = new Map();

    for (const realm of REALMS) {
        for (const zoneId in realm.zones) {
            const zone = realm.zones[zoneId];
            for (const subZoneId in zone.subZones) {
                const subZone = zone.subZones[subZoneId];
                if (!subZone.monsterPool) continue;

                for (const monster of subZone.monsterPool) {
                    if (!monster.lootTable) continue;

                    const firstMonsterLevel = subZone.levelRange[0];

                    for (const loot of monster.lootTable) {
                        const itemId = loot.item.id;
                        const currentInfo = itemDropInfo.get(itemId);

                        if (!currentInfo || firstMonsterLevel < currentInfo.minLevel) {
                            itemDropInfo.set(itemId, {
                                minLevel: firstMonsterLevel,
                                realmName: realm.name
                            });
                        }
                    }
                }
            }
        }
    }

    // --- STEP 2: Group data by Slot -> Stat -> Realm ---
    const groupedData = {}; // { slotType: { statKey: { realmName: [dataPoints] } } }

    for (const itemId in ITEMS) {
        const item = ITEMS[itemId];
        const dropInfo = itemDropInfo.get(item.id);

        if (!dropInfo) {
            console.warn(`Orphaned item: ${item.name} (ID: ${item.id}) has no drop source and will be excluded from graphs.`);
            continue;
        }

        const realmName = dropInfo.realmName;
        const slotType = item.type;
        const dropLevel = dropInfo.minLevel;

        if (!groupedData[slotType]) groupedData[slotType] = {};

        for (const stat of item.possibleStats) {
            const statKey = stat.key;
            if (!groupedData[slotType][statKey]) {
                groupedData[slotType][statKey] = {};
            }
            if (!groupedData[slotType][statKey][realmName]) {
                groupedData[slotType][statKey][realmName] = [];
            }
            
            const maxStatValue = stat.max;

            groupedData[slotType][statKey][realmName].push({
                x: dropLevel,
                y: maxStatValue,
                label: item.name,
            });
        }
    }

    // --- STEP 3: Populate Realm Filter Checkboxes ---
    const realmFilterContainer = document.getElementById('realm-filter-container');
    
    const selectAllDiv = document.createElement('div');
    selectAllDiv.className = 'realm-filter';
    selectAllDiv.innerHTML = `<input type="checkbox" id="realm-filter-all" checked><label for="realm-filter-all"><b>Select All</b></label>`;
    realmFilterContainer.appendChild(selectAllDiv);

    REALMS.forEach(realm => {
        const realmDiv = document.createElement('div');
        realmDiv.className = 'realm-filter';
        realmDiv.innerHTML = `<input type="checkbox" id="realm-filter-${realm.name.replace(/\s+/g, '-')}" data-realm-name="${realm.name}" checked><label for="realm-filter-${realm.name.replace(/\s+/g, '-')}">${realm.name}</label>`;
        realmFilterContainer.appendChild(realmDiv);
    });

    // --- Functions to save and load filter state, now including scale type ---
    function saveFilters() {
        const activeStatFilter = /** @type {HTMLElement} */(document.querySelector('#stat-filter-container .filter-btn.active')).dataset.statFilter;
        
        const scaleToggleButton = /** @type {HTMLButtonElement} */(document.getElementById('scale-toggle-btn'));
        const currentScale = scaleToggleButton.dataset.scale || 'logarithmic';

        const realmCheckboxes = document.querySelectorAll('#realm-filter-container input[data-realm-name]');
        const realmStates = {};
        realmCheckboxes.forEach(cb => {
            const input = /** @type {HTMLInputElement} */(cb);
            if (input.dataset.realmName) {
                realmStates[input.dataset.realmName] = input.checked;
            }
        });
    
        const filterState = {
            activeStat: activeStatFilter,
            realmStates: realmStates,
            scaleType: currentScale,
        };
    
        localStorage.setItem('graphFilterState', JSON.stringify(filterState));
    }

    function loadFilters() {
        const savedFilters = localStorage.getItem('graphFilterState');
        if (!savedFilters) return 'logarithmic'; 
    
        try {
            const { activeStat, realmStates, scaleType } = JSON.parse(savedFilters);
    
            if (activeStat) {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    btn.classList.toggle('active', (/** @type {HTMLElement} */(btn)).dataset.statFilter === activeStat);
                });
            }
    
            if (realmStates) {
                let allChecked = true;
                const realmCheckboxes = document.querySelectorAll('#realm-filter-container input[data-realm-name]');
                realmCheckboxes.forEach(cb => {
                    const input = /** @type {HTMLInputElement} */(cb);
                    const realmName = input.dataset.realmName;
                    if (realmStates.hasOwnProperty(realmName)) {
                        input.checked = realmStates[realmName];
                        if (!input.checked) allChecked = false;
                    } else {
                        allChecked = false;
                    }
                });
                
                const selectAllCheckbox = /** @type {HTMLInputElement} */(document.getElementById('realm-filter-all'));
                if (selectAllCheckbox) selectAllCheckbox.checked = allChecked;
            }
            
            return scaleType || 'logarithmic';

        } catch (e) {
            console.error("Failed to load or parse filter state from localStorage:", e);
            localStorage.removeItem('graphFilterState');
            return 'logarithmic';
        }
    }
    
    // --- STEP 4: Create a chart for each (Slot, Stat) combination ---
    const chartContainer = document.getElementById('chart-container');
    const chartInstances = [];
    let currentScaleType = loadFilters();
    const chartColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#1abc9c', '#e67e22', '#34495e'];
    
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const numberAbbreviations = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    
    const formatGameNumber = (num) => {
        if (num < 1000) return Math.floor(num).toString();
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
        if (tier === 0 || tier > numberAbbreviations.length) return num.toExponential(2);
        const suffix = numberAbbreviations[tier - 1];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(2) + suffix;
    };
    
    const formatAxisNumber = (num) => {
        if (num < 1000) return num.toString();
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
        if (tier === 0 || tier > numberAbbreviations.length) return num.toExponential(0);
        const suffix = numberAbbreviations[tier - 1];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(scaled < 10 ? 1 : 0) + suffix;
    };

    for (const slotType in groupedData) {
        for (const statKey in groupedData[slotType]) {
            const realmsForStat = groupedData[slotType][statKey];
            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: 'Unknown Stat' };
            const chartTitle = `${capitalize(slotType)} - ${statInfo.name} Progression`;

            const datasets = [];
            let colorIndex = 0;
            for (const realmName in realmsForStat) {
                const dataPoints = realmsForStat[realmName];
                if (dataPoints.length === 0) continue;
                dataPoints.sort((a, b) => a.x - b.x);

                datasets.push({
                    label: realmName,
                    data: dataPoints,
                    borderColor: chartColors[colorIndex % chartColors.length],
                    backgroundColor: chartColors[colorIndex % chartColors.length] + '33',
                    tension: 0.1,
                    fill: false,
                });
                colorIndex++;
            }

            if (datasets.length === 0) continue;

            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper';
            wrapper.dataset.stat = statKey;

            const canvas = document.createElement('canvas');
            wrapper.appendChild(canvas);
            chartContainer.appendChild(wrapper);

            const chart = new (/** @type {any} */(window)).Chart(canvas, {
                type: 'line',
                data: { datasets },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: { type: 'linear', title: { display: true, text: 'Item First Drop Level', color: '#ecf0f1', font: { size: 14 } }, ticks: { color: '#bdc3c7' } },
                        y: { type: currentScaleType, title: { display: true, text: `${statInfo.name} (Max Value)`, color: '#ecf0f1', font: { size: 14 } }, ticks: { color: '#bdc3c7', callback: (val) => formatAxisNumber(val) } }
                    },
                    plugins: {
                        title: { display: true, text: chartTitle, color: '#f1c40f', font: { size: 18 } },
                        tooltip: { callbacks: { title: (ctx) => ctx[0].raw.label, label: (ctx) => `${ctx.dataset.label}: ${formatGameNumber(ctx.raw.y)}` } }
                    }
                }
            });
            chartInstances.push(chart);
        }
    }

    // --- STEP 5: Add filtering and interaction logic ---
    const allFiltersContainer = document.getElementById('all-filters-container');
    const scaleToggleButton = /** @type {HTMLButtonElement} */(document.getElementById('scale-toggle-btn'));

    function updateScaleToggleButton() {
        scaleToggleButton.dataset.scale = currentScaleType;
        scaleToggleButton.textContent = currentScaleType === 'logarithmic' ? 'Switch to Linear Scale' : 'Switch to Logarithmic Scale';
    }

    function applyFilters() {
        const realmCheckboxes = document.querySelectorAll('#realm-filter-container input[data-realm-name]');
        const selectedRealms = Array.from(realmCheckboxes)
            .filter(cb => (/** @type {HTMLInputElement} */(cb)).checked)
            .map(cb => (/** @type {HTMLElement} */(cb)).dataset.realmName);

        const activeStatFilter = /** @type {HTMLElement} */(document.querySelector('#stat-filter-container .filter-btn.active')).dataset.statFilter;

        chartInstances.forEach(chart => {
            const wrapper = /** @type {HTMLElement} */ (chart.canvas.parentElement);
            const statMatch = activeStatFilter === 'all' || wrapper.dataset.stat === activeStatFilter;
            wrapper.classList.toggle('hidden', !statMatch);
            
            // --- START OF NEW AXIS LOGIC ---
            let maxVisibleY = -Infinity;

            chart.data.datasets.forEach(dataset => {
                const isVisible = selectedRealms.includes(dataset.label);
                dataset.hidden = !isVisible;

                if (isVisible) {
                    dataset.data.forEach(point => {
                        if (point.y > maxVisibleY) {
                            maxVisibleY = point.y;
                        }
                    });
                }
            });
            
            if (isFinite(maxVisibleY) && maxVisibleY > -Infinity) {
                // Set the max with a 10% buffer to avoid the point being on the edge
                chart.options.scales.y.max = maxVisibleY * 1.1;
            } else {
                // If no data is visible, let Chart.js autoscale by removing the max
                chart.options.scales.y.max = undefined;
            }
            // --- END OF NEW AXIS LOGIC ---

            chart.update();
        });
    }

    allFiltersContainer.addEventListener('click', (e) => {
        if (e.target instanceof HTMLElement) {
            if (e.target.matches('.filter-btn') && e.target.id !== 'scale-toggle-btn') {
                document.querySelectorAll('.filter-btn').forEach(btn => {
                    if (btn.id !== 'scale-toggle-btn') btn.classList.remove('active');
                });
                e.target.classList.add('active');
                applyFilters();
                saveFilters();
            }
        }
    });

    scaleToggleButton.addEventListener('click', () => {
        currentScaleType = currentScaleType === 'logarithmic' ? 'linear' : 'logarithmic';
        updateScaleToggleButton();
        
        chartInstances.forEach(chart => {
            chart.options.scales.y.type = currentScaleType;
        });

        applyFilters(); // Re-apply filters to recalculate axis maxima
        saveFilters();
    });

    allFiltersContainer.addEventListener('change', (e) => {
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            const selectAllCheckbox = /** @type {HTMLInputElement} */ (document.getElementById('realm-filter-all'));
            const realmCheckboxes = document.querySelectorAll('#realm-filter-container input[data-realm-name]');

            if (e.target.id === 'realm-filter-all') {
                realmCheckboxes.forEach(cb => { (/** @type {HTMLInputElement} */ (cb)).checked = selectAllCheckbox.checked; });
            } else {
                selectAllCheckbox.checked = Array.from(realmCheckboxes).every(cb => (/** @type {HTMLInputElement} */ (cb)).checked);
            }
            applyFilters();
            saveFilters();
        }
    });

    updateScaleToggleButton();
    applyFilters();
});