import { ITEMS } from './data/items.js';
import { MONSTERS } from './data/monsters.js';
import { REALMS } from './data/realms.js';
import { STATS } from './data/stat_pools.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // --- STEP 1: Find the minimum drop level for every item ---
    const itemDropLevels = new Map();

    for (const monsterKey in MONSTERS) {
        const monster = MONSTERS[monsterKey];
        if (!monster.lootTable) continue;

        const monsterLocations = [];
        for (const realm of REALMS) {
            for (const zoneId in realm.zones) {
                const zone = realm.zones[zoneId];
                for (const subZoneId in zone.subZones) {
                    const subZone = zone.subZones[subZoneId];
                    if (subZone.monsterPool.includes(monster)) {
                        monsterLocations.push(subZone);
                    }
                }
            }
        }
        if (monsterLocations.length === 0) continue;

        const firstMonsterLevel = Math.min(...monsterLocations.map(sz => sz.levelRange[0]));

        for (const loot of monster.lootTable) {
            const itemId = loot.item.id;
            const currentMinLevel = itemDropLevels.get(itemId) || Infinity;
            if (firstMonsterLevel < currentMinLevel) {
                itemDropLevels.set(itemId, firstMonsterLevel);
            }
        }
    }

    // --- STEP 2: Group all item data by slot and then by stat ---
    const groupedData = {};
    const chartInstances = []; // Store chart instances to access their data later

    for (const itemId in ITEMS) {
        const item = ITEMS[itemId];
        const dropLevel = itemDropLevels.get(item.id);

        if (dropLevel === undefined) {
            console.warn(`Orphaned item: ${item.name} (ID: ${item.id}) has no drop source and will be excluded from graphs.`);
            continue;
        }

        const slotType = item.type;
        if (!groupedData[slotType]) {
            groupedData[slotType] = {};
        }

        for (const stat of item.possibleStats) {
            const statKey = stat.key;
            if (!groupedData[slotType][statKey]) {
                groupedData[slotType][statKey] = [];
            }
            
            const averageStatValue = (stat.min + stat.max) / 2;

            groupedData[slotType][statKey].push({
                x: dropLevel,
                y: averageStatValue,
                label: item.name,
            });
        }
    }

    // --- STEP 3: Create a chart for each group ---
    const chartContainer = document.getElementById('chart-container');
    const chartColors = ['#e74c3c', '#3498db', '#2ecc71', '#9b59b6', '#f1c40f', '#1abc9c', '#e67e22', '#34495e'];
    let colorIndex = 0;

    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    
    const numberAbbreviations = ['K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No', 'Dc'];
    const formatGameNumber = (num) => {
        if (num < 1000) {
            return Math.floor(num).toString();
        }
        const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
        if (tier === 0 || tier > numberAbbreviations.length) {
            return num.toExponential(2);
        }
        const suffix = numberAbbreviations[tier - 1];
        const scale = Math.pow(10, tier * 3);
        const scaled = num / scale;
        return scaled.toFixed(2) + suffix;
    };
    
    // A slightly less precise version for crowded axis labels
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
            const dataPoints = groupedData[slotType][statKey];
            if (dataPoints.length < 2) continue;

            dataPoints.sort((a, b) => a.x - b.x);

            const statInfo = Object.values(STATS).find(s => s.key === statKey) || { name: 'Unknown Stat' };
            const chartTitle = `${capitalize(slotType)} - ${statInfo.name} Progression`;

            const wrapper = document.createElement('div');
            wrapper.className = 'chart-wrapper';
            wrapper.dataset.statKey = statKey;
            wrapper.dataset.slotType = slotType;
            const canvas = document.createElement('canvas');
            wrapper.appendChild(canvas);
            chartContainer.appendChild(wrapper);

            const color = chartColors[colorIndex % chartColors.length];
            colorIndex++;
            
            const chart = new (/** @type {any} */ (window)).Chart(canvas, {
                type: 'line',
                data: {
                    datasets: [{
                        label: `${capitalize(slotType)}`,
                        data: dataPoints,
                        borderColor: color,
                        backgroundColor: color + '33',
                        tension: 0.1,
                        fill: true,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                        x: { type: 'linear', title: { display: true, text: 'Item First Drop Level', color: '#ecf0f1', font: { size: 14 } }, ticks: { color: '#bdc3c7' } },
                        y: { type: 'logarithmic', title: { display: true, text: `${statInfo.name} (Avg Value)`, color: '#ecf0f1', font: { size: 14 } }, 
                            ticks: { color: '#bdc3c7', callback: (val) => formatAxisNumber(val) } 
                        }
                    },
                    plugins: {
                        title: { display: true, text: chartTitle, color: '#f1c40f', font: { size: 18 } },
                        // --- START OF FIX: Custom tooltip label formatting ---
                        tooltip: { 
                            callbacks: { 
                                title: (ctx) => ctx[0].raw.label, 
                                label: (ctx) => `${ctx.dataset.label}: ${formatGameNumber(ctx.raw.y)}`
                            } 
                        }
                        // --- END OF FIX ---
                    }
                }
            });
            chartInstances.push(chart);
        }
    }

    // --- STEP 4: Add filtering logic ---
    const filterContainer = document.getElementById('filter-container');
    const chartWrappers = document.querySelectorAll('.chart-wrapper');
    const combineBtn = document.getElementById('combine-graphs-btn');
    const combinedChartWrapper = document.getElementById('combined-chart-wrapper');
    let combinedChartInstance = null;

    function createCombinedChart(statKey, statName) {
        if (combinedChartInstance) {
            combinedChartInstance.destroy();
        }

        const visibleCharts = chartInstances.filter(chart => {
            const wrapper = chart.canvas.parentElement;
            return wrapper instanceof HTMLElement && wrapper.dataset.statKey === statKey && !wrapper.classList.contains('hidden');
        });
        
        const datasets = visibleCharts.map((chart, index) => {
            const originalDataset = chart.data.datasets[0];
            const slotType = (/** @type {HTMLElement} */ (chart.canvas.parentElement)).dataset.slotType;
            return {
                label: capitalize(slotType),
                data: originalDataset.data,
                borderColor: chartColors[index % chartColors.length],
                backgroundColor: 'transparent',
                tension: 0.1,
            };
        });

        const canvas = document.getElementById('combined-chart-canvas');
        combinedChartInstance = new (/** @type {any} */ (window)).Chart(canvas, {
            type: 'line',
            data: { datasets },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scales: {
                    x: { type: 'linear', title: { display: true, text: 'Item First Drop Level', color: '#ecf0f1', font: { size: 14 } }, ticks: { color: '#bdc3c7' } },
                    y: { type: 'logarithmic', title: { display: true, text: `${statName} (Avg Value)`, color: '#ecf0f1', font: { size: 14 } }, 
                        ticks: { color: '#bdc3c7', callback: (val) => formatAxisNumber(val) } 
                    }
                },
                plugins: {
                    title: { display: true, text: `Combined Progression for ${statName}`, color: '#f1c40f', font: { size: 18 } },
                    // --- START OF FIX: Custom tooltip label formatting for combined chart ---
                    tooltip: { 
                        mode: 'index', 
                        intersect: false, 
                        callbacks: { 
                            title: (ctx) => `Level ${ctx[0].label}`, 
                            label: (ctx) => `${ctx.dataset.label}: ${formatGameNumber(ctx.raw.y)}`
                        } 
                    }
                    // --- END OF FIX ---
                }
            }
        });

        chartWrappers.forEach(wrapper => wrapper.classList.add('hidden'));
        combinedChartWrapper.classList.remove('hidden');
    }

    filterContainer.addEventListener('click', (e) => {
        if (!(e.target instanceof HTMLElement) || e.target.tagName !== 'BUTTON') return;
        
        const target = /** @type {HTMLButtonElement} */ (e.target);

        if (target.id === 'combine-graphs-btn') {
            const activeFilterBtn = filterContainer.querySelector('.filter-btn.active');
            if (activeFilterBtn instanceof HTMLElement) {
                const statKey = activeFilterBtn.dataset.statFilter;
                const statName = activeFilterBtn.textContent;
                createCombinedChart(statKey, statName);
            }
            return;
        }

        if (combinedChartInstance) {
            combinedChartInstance.destroy();
            combinedChartInstance = null;
        }
        combinedChartWrapper.classList.add('hidden');


        const filterKey = target.dataset.statFilter;

        filterContainer.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        target.classList.add('active');

        chartWrappers.forEach(wrapper => {
            const chartWrapper = /** @type {HTMLElement} */ (wrapper);
            if (filterKey === 'all' || chartWrapper.dataset.statKey === filterKey) {
                chartWrapper.classList.remove('hidden');
            } else {
                chartWrapper.classList.add('hidden');
            }
        });
        
        combineBtn.classList.toggle('hidden', filterKey === 'all');
    });
});